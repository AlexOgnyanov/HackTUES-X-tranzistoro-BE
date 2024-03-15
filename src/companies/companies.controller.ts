import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  FileTypeValidator,
  ParseFilePipe,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, PermissionsGuard } from 'src/auth/guards';
import { CheckPermissions } from 'src/auth/decorators';
import { PermissionAction, PermissionObject } from 'src/permissions/enums';
import { FileInterceptor } from '@nestjs/platform-express';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { RequestWithUser } from 'src/auth/dtos';

import { CompaniesService } from './companies.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';

@ApiBearerAuth('AccessToken')
@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get('grid')
  async getCompaniesFilterForGrid() {
    return await this.companiesService.getCompaniesFilterForGrid();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckPermissions([PermissionAction.Update, PermissionObject.Company])
  @UseInterceptors(
    FileInterceptor('image', { limits: { fileSize: 2 * 1024 * 1024 } }),
  )
  @Post('change-logo/:id')
  async changeLogo(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: new RegExp('.*.(jpe?g|png)$'),
          }),
        ],
        fileIsRequired: true,
      }),
    )
    image: Express.Multer.File,
  ) {
    return await this.companiesService.changeLogo(req.user, +id, image);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckPermissions([PermissionAction.Create, PermissionObject.Company])
  @UseInterceptors(
    FileInterceptor('image', { limits: { fileSize: 2 * 1024 * 1024 } }),
  )
  @Post()
  async create(
    @Body() dto: CreateCompanyDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: new RegExp('.*.(jpe?g|png)$'),
          }),
        ],
        fileIsRequired: true,
      }),
    )
    image: Express.Multer.File,
  ) {
    return await this.companiesService.create(dto, image);
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.companiesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.companiesService.findOneOrFail(+id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckPermissions([PermissionAction.Update, PermissionObject.Company])
  @Patch(':id')
  async update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
  ) {
    return await this.companiesService.update(req.user, +id, dto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @CheckPermissions([PermissionAction.Delete, PermissionObject.Company])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.companiesService.remove(+id);
  }
}
