import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, PermissionsGuard } from 'src/auth/guards';
import { CheckPermissions } from 'src/auth/decorators';
import { PermissionAction, PermissionObject } from 'src/permissions/enums';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

import { FacilitiesService } from './facilities.service';
import {
  CreateDepartmentDto,
  CreateFacilityDto,
  UpdateDepartmentDto,
  UpdateFacilityDto,
} from './dto';

@ApiBearerAuth('AccessToken')
@ApiTags('Facilities')
@Controller('facilities')
export class FacilitiesController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @Get('tags')
  async getTags() {
    return this.facilitiesService.getTags();
  }

  @Get('departments')
  async getDepartments() {
    return this.facilitiesService.getDepartments();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckPermissions([PermissionAction.Create, PermissionObject.Facility])
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'thumbnail', maxCount: 1 }, { name: 'gallery' }],
      {
        limits: { fileSize: 2 * 1024 * 1024 },
      },
    ),
  )
  async create(
    @Body() dto: CreateFacilityDto,
    @UploadedFiles()
    files?: {
      thumbnail?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
  ) {
    return await this.facilitiesService.create(dto, files);
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.facilitiesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.facilitiesService.findOneOrFail(+id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckPermissions([PermissionAction.Update, PermissionObject.Facility])
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateFacilityDto) {
    return await this.facilitiesService.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckPermissions([PermissionAction.Delete, PermissionObject.Facility])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.facilitiesService.remove(+id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckPermissions([PermissionAction.Create, PermissionObject.Department])
  @Post('departments')
  async createDepartment(@Body() dto: CreateDepartmentDto) {
    return await this.facilitiesService.createDepartment(dto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckPermissions([PermissionAction.Update, PermissionObject.Department])
  @Patch('departments/:id')
  async updateDepartment(
    @Param('id') id: string,
    @Body() dto: UpdateDepartmentDto,
  ) {
    return await this.facilitiesService.updateDepartment(+id, dto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckPermissions([PermissionAction.Delete, PermissionObject.Department])
  @Delete('departments/:id')
  async removeDepartment(@Param('id') id: string) {
    return await this.facilitiesService.removeDepartment(+id);
  }
}
