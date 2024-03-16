import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthErrorCodes } from 'src/auth/errors';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { TokensService } from 'src/tokens/tokens.service';
import { PermissionAction, PermissionObject } from 'src/permissions/enums';
import { RoleEntity } from 'src/roles/entities';
import { RequiredPermission } from 'src/permissions/types';
import { RoleErrorCodes } from 'src/roles/errors';

import { CreateUserDto, UpdateUserDto } from './dtos';
import { UserEntity } from './entities';
import { UserErrorCodes } from './errors/user-errors.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly tokensService: TokensService,
    private readonly sendgridService: SendgridService,
  ) {}

  async create(dto: CreateUserDto) {
    await this.checkCredentialsOrFail(dto.email, dto.phone);
    const user = this.userRepository.create({ ...dto });

    return await this.userRepository.save(user);
  }

  async findOne(id: string, companyId?: number) {
    return this.userRepository.findOne({
      relations: {
        company: true,
        role: {
          permissions: {
            roles: false,
          },
        },
      },
      where: {
        id,
        ...(companyId ? { company: { id: companyId } } : {}),
      },
    });
  }

  async findOneOrFail(id: string, companyId?: number) {
    const user = await this.findOne(id, companyId);
    if (!user) {
      throw new NotFoundException(AuthErrorCodes.UserNotFoundError);
    }
    return user;
  }

  async findAll() {
    const query = this.userRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.role', 'role')
      .leftJoinAndSelect('u.company', 'company');

    return await query.getMany();
  }

  async update(id: string, dto: UpdateUserDto) {
    const userEntity = await this.findOneOrFail(id);

    await this.userRepository.update(id, {
      ...userEntity,
      ...dto,
    });
  }

  async delete(id: string) {
    const userEntity = await this.findOneOrFail(id);
    return await this.userRepository.remove(userEntity);
  }

  async checkCredentialsOrFail(email: string, phone: string) {
    await this.checkEmailOrFail(email);
    await this.checkPhoneOrFail(phone);
  }

  async checkEmailOrFail(email: string) {
    if (await this.isEmailTaken(email)) {
      throw new BadRequestException(UserErrorCodes.EmailTakenError);
    }
  }

  async checkPhoneOrFail(phone: string) {
    if (await this.isPhoneTaken(phone)) {
      throw new BadRequestException(UserErrorCodes.PhoneTakenError);
    }
  }

  async isEmailTaken(email: string) {
    return await this.userRepository.exist({
      where: {
        email,
      },
    });
  }

  async isPhoneTaken(phone: string) {
    if (!phone) return false;
    return await this.userRepository.exist({
      where: {
        phone,
      },
    });
  }

  async createOwnerUser(contactEmail: string) {
    await this.checkEmailOrFail(contactEmail);
    const role = await this.findRoleByPermissionsOrFail([
      PermissionAction.Manage,
      PermissionObject.Company,
    ]);

    const user = this.userRepository.create({
      email: contactEmail,
      password: null,
      role: {
        id: role.id,
      },
    });

    const userEntity = await this.userRepository.save(user);
    const token = await this.tokensService.generateEmailConfirmationToken(
      userEntity.id,
    );

    await this.sendgridService.sendEmailVerification(user.email, token.token);

    return userEntity;
  }

  async findRoleByPermissionsOrFail(permissions: RequiredPermission) {
    const role = await this.roleRepository.findOne({
      relations: {
        permissions: true,
      },
      where: {
        permissions: {
          action: permissions[0],
          object: permissions[1],
        },
      },
    });

    if (!role) {
      throw new NotFoundException(RoleErrorCodes.RoleNotFoundError);
    }

    return role;
  }
}
