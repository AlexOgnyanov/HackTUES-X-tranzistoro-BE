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
import { ApiResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { RoleEntity } from 'src/roles/entities/role.entity';
import { JwtAuthGuard, PermissionsGuard } from 'src/auth/guards';
import { CheckPermissions } from 'src/auth/decorators';
import { PermissionAction, PermissionObject } from 'src/permissions/enums';
import { RequestWithUser } from 'src/auth/dtos';

import { RolesService } from './roles.service';
import { AssignRoleToUserDto, CreateRoleDto } from './dtos';
import { UpdateRoleDto } from './dtos/update-role.dto';

@ApiTags('Roles')
@ApiBearerAuth('AccessToken')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiResponse({
    status: 200,
    description: 'Create role',
  })
  @CheckPermissions([PermissionAction.Create, PermissionObject.Role])
  @Post()
  async create(
    @Request() req: RequestWithUser,
    @Body() dto: CreateRoleDto,
  ): Promise<RoleEntity> {
    return await this.rolesService.create(req.user, dto);
  }

  @ApiResponse({
    status: 200,
    description: 'Get role by id',
  })
  @CheckPermissions([PermissionAction.Read, PermissionObject.Role])
  @Get(':id')
  async findOneRole(
    @Request() req: RequestWithUser,
    @Param('id') id: number,
  ): Promise<RoleEntity | null> {
    return await this.rolesService.findOneRoleOrFail(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Get all roles',
  })
  @CheckPermissions([PermissionAction.Read, PermissionObject.Role])
  @Get()
  async findAllRoles(
    @Request() req: RequestWithUser,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<RoleEntity>> {
    return await this.rolesService.findAllRoles(query);
  }

  @ApiResponse({
    status: 200,
    description: 'Update role',
  })
  @CheckPermissions([PermissionAction.Update, PermissionObject.Role])
  @Put(':id')
  async updateRole(
    @Request() req: RequestWithUser,
    @Param('id') id: number,
    @Body() dto: UpdateRoleDto,
  ): Promise<RoleEntity> {
    return await this.rolesService.update(req.user, id, dto);
  }

  @ApiResponse({
    status: 200,
    description: 'Delete role',
  })
  @CheckPermissions([PermissionAction.Delete, PermissionObject.Role])
  @Delete(':id')
  async deleteRole(@Request() req: RequestWithUser, @Param('id') id: number) {
    return await this.rolesService.delete(req.user, id);
  }

  @CheckPermissions([PermissionAction.Update, PermissionObject.User])
  @Post('assign')
  async assignRole(
    @Request() req: RequestWithUser,
    @Body() dto: AssignRoleToUserDto,
  ) {
    return await this.rolesService.assignRole(req.user, dto);
  }
}
