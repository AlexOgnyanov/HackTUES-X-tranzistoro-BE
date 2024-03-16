import { Module } from '@nestjs/common';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from 'src/files/files.module';

import { FacilitiesService } from './facilities.service';
import { FacilitiesController } from './facilities.controller';
import { AttendanceEntity, DepartmentEntity, FacilityEntity } from './entities';
import { CameraEntity } from './entities/cameras.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FacilityEntity,
      DepartmentEntity,
      CameraEntity,
      AttendanceEntity,
    ]),
    PermissionsModule,
    FilesModule,
  ],
  controllers: [FacilitiesController],
  providers: [FacilitiesService],
  exports: [FacilitiesService],
})
export class FacilitiesModule {}
