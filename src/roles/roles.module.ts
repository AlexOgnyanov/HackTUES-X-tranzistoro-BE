import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from 'src/permissions/entities/permission.entity';
import { UserEntity } from 'src/user/entities';
import { UserModule } from 'src/user/user.module';
import { PermissionsModule } from 'src/permissions/permissions.module';

import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RoleEntity } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, PermissionEntity, RoleEntity]),
    UserModule,
    PermissionsModule,
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
