import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ContextUser } from '../dtos';
import { AuthErrorCodes } from '../errors';
import { SessionEntity } from '../entities';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: ContextUser) {
    const user = await this.userService.findOne(payload.id);

    if (!user.isVerified) {
      throw new BadRequestException(AuthErrorCodes.AccountNotVerifiedError);
    }

    const session = await this.sessionRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
        id: payload.sessionId,
      },
    });

    if (!session) {
      throw new BadRequestException(AuthErrorCodes.SessionNotFoundError);
    }

    user.sessions = [session];
    return user;
  }
}
