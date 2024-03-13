import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { TokensService } from 'src/tokens/tokens.service';
import { UserErrorCodes } from 'src/user/errors/user-errors.enum';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';
import ms from 'ms';
import { SendgridService } from 'src/sendgrid/sendgrid.service';

import {
  VerifyUserDto,
  RequestPasswordChangeDto,
  PasswordChangeDto,
  ContextUser,
} from './dtos';
import { AuthErrorCodes } from './errors';
import { SessionEntity } from './entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(SessionEntity)
    private readonly sessionsRepository: Repository<SessionEntity>,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokensService,
    private readonly sendgridService: SendgridService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.sessions', 'sessions')
      .select([
        'user.id',
        'role',
        'sessions',
        'user.password',
        'user.isVerified',
      ])
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException(AuthErrorCodes.UserNotFoundError);
    }

    const isPasswordMatching = await argon2.verify(user.password, password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException(AuthErrorCodes.IncorrectPasswordError);
    }

    if (!user.isVerified) {
      throw new ForbiddenException(AuthErrorCodes.AccountNotVerifiedError);
    }

    return user;
  }

  async verify(dto: VerifyUserDto) {
    const token = await this.tokenService.findEmailConfirmationTokenOrFail(
      dto.token,
    );

    token.user.password = dto.password;
    token.user.isVerified = true;

    await this.tokenService.deleteEmailConfirmationToken(token);

    return await this.userRepository.save(token.user);
  }

  async requestPasswordReset(dto: RequestPasswordChangeDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new NotFoundException(UserErrorCodes.UserNotFoundError);
    }

    const token = await this.tokenService.generatePasswordResetToken(user.id);

    await this.sendgridService.sendPasswordReset(user.email, token.token);
    return 'Success';
  }

  async passwordReset(dto: PasswordChangeDto) {
    const token = await this.tokenService.findPasswordResetTokenOrFail(
      dto.token,
    );

    token.user.password = dto.newPassword;

    const user = await this.userRepository.save(token.user);

    await this.tokenService.deletePasswordResetToken(token);

    return user;
  }

  async requestPasswordChange(user: UserEntity) {
    const token = await this.tokenService.generatePasswordChangeToken(user);

    await this.sendgridService.sendPasswordChange(user.email, token.token);
    return 'Success';
  }

  async passwordChange(dto: PasswordChangeDto) {
    const token = await this.tokenService.findPasswordChangeTokenOrFail(
      dto.token,
    );

    token.user.password = dto.newPassword;

    const user = await this.userRepository.save(token.user);

    await this.tokenService.deletePasswordChangeToken(token);

    return user;
  }

  async createSession(
    sessionId: string,
    user: UserEntity,
    refreshToken: string,
  ) {
    const session = this.sessionsRepository.create({
      id: sessionId,
      user,
      refreshToken: refreshToken,
      expiresAt: new Date(
        Date.now() + ms(this.configService.get('JWT_REFRESH_EXPIRES_IN')),
      ),
    });

    return await this.sessionsRepository.save(session);
  }

  async generateTokens(payload: ContextUser) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async login(user: UserEntity) {
    const sessionId = nanoid();

    const payload: ContextUser = {
      id: user.id,
      roleId: user?.role?.id,
      sessionId,
    };

    const tokens = await this.generateTokens(payload);

    await this.createSession(sessionId, user, tokens.refreshToken);

    return tokens;
  }

  async refresh(session: SessionEntity) {
    const tokens = await this.generateTokens({
      id: session?.user.id,
      roleId: session?.user?.role?.id,
      sessionId: session?.id,
    } as ContextUser);

    const expiresAt = new Date(
      Date.now() + ms(this.configService.get('JWT_REFRESH_EXPIRES_IN')),
    );

    await this.sessionsRepository.update(session, {
      expiresAt,
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  }

  async logout(sessionId: string) {
    await this.sessionsRepository.delete(sessionId);
  }

  async globalLogout(user: UserEntity) {
    await this.sessionsRepository.delete({
      user: user,
    });
  }
}
