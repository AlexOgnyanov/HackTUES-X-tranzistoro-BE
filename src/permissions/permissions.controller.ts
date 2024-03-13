import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, PermissionsGuard } from 'src/auth/guards';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { CheckPermissions } from 'src/auth/decorators';
import { RequestWithUser } from 'src/auth/dtos';

import { PermissionsService } from './permissions.service';
import { PermissionEntity } from './entities';
import { CreatePermissionDto, UpdatePermissionDto } from './dtos';
import { PermissionAction, PermissionObject } from './enums';

@ApiBearerAuth('AccessToken')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @ApiResponse({
    status: 200,
    description: 'Create permission',
  })
  @CheckPermissions([PermissionAction.Create, PermissionObject.Permission])
  @Post()
  async createPermission(
    @Request() req: RequestWithUser,
    @Body() dto: CreatePermissionDto,
  ): Promise<PermissionEntity> {
    return await this.permissionsService.createPermission(req.user, dto);
  }

  @Get('options')
  async getPermissionOptions() {
    return this.permissionsService.getPermissionOptions();
  }

  @ApiResponse({
    status: 200,
    description: 'Get all permissions',
  })
  @CheckPermissions([PermissionAction.Read, PermissionObject.Permission])
  @Get()
  async findAllPermission(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<PermissionEntity>> {
    return await this.permissionsService.findAllPermission(query);
  }

  @ApiResponse({
    status: 200,
    description: 'Get permission by id',
  })
  @CheckPermissions([PermissionAction.Read, PermissionObject.Permission])
  @Get(':id')
  async findOnePermission(
    @Param('id') id: number,
  ): Promise<PermissionEntity | null> {
    return await this.permissionsService.findOnePermissionOrFail(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Update permission',
  })
  @CheckPermissions([PermissionAction.Update, PermissionObject.Permission])
  @Put(':id')
  async updatePermission(
    @Request() req: RequestWithUser,
    @Param('id') id: number,
    @Body() dto: UpdatePermissionDto,
  ): Promise<PermissionEntity> {
    return await this.permissionsService.updatePermission(req.user, id, dto);
  }

  @ApiResponse({
    status: 200,
    description: 'Delete permission',
  })
  @CheckPermissions([PermissionAction.Delete, PermissionObject.Permission])
  @Delete(':id')
  async deletePermission(@Param('id') id: number) {
    return await this.permissionsService.deletePermission(id);
  }
}
