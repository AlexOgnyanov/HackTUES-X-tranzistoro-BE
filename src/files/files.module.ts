import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilesService } from './files.service';
import { FileEntity } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
