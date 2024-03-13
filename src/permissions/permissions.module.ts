import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PermissionEntity } from './entities';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { CaslAbilityFactory } from './casl-ability.factory';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionEntity])],
  controllers: [PermissionsController],
  providers: [CaslAbilityFactory, PermissionsService],
  exports: [CaslAbilityFactory, PermissionsService],
})
export class PermissionsModule {}
