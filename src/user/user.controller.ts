import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, PermissionsGuard } from 'src/auth/guards';
import { RequestWithUser } from 'src/auth/dtos';
import { CheckPermissions } from 'src/auth/decorators';
import { PermissionAction, PermissionObject } from 'src/permissions/enums';

import { CreateUserDto, UpdateUserDto } from './dtos';
import { UserService } from './user.service';

@ApiBearerAuth('AccessToken')
@ApiTags('Users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMe(@Request() req: RequestWithUser) {
    return await this.userService.findOne(req.user.id);
  }

  @CheckPermissions([PermissionAction.Create, PermissionObject.User])
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return await this.userService.create(dto);
  }

  @CheckPermissions([PermissionAction.Read, PermissionObject.User])
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @CheckPermissions([PermissionAction.Update, PermissionObject.User])
  @Patch(':id')
  async update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(id, updateUserDto);
  }

  @CheckPermissions([PermissionAction.Delete, PermissionObject.User])
  @Delete(':id')
  async remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return await this.userService.delete(id);
  }
}
