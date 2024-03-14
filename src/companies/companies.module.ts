import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { FilesModule } from 'src/files/files.module';
import { UserModule } from 'src/user/user.module';

import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { CompanyEntity } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyEntity]),
    PermissionsModule,
    FilesModule,
    UserModule,
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
