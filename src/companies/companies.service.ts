import { Injectable, NotFoundException } from '@nestjs/common';
import { FilesService } from 'src/files/files.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { UserEntity } from 'src/user/entities';
import { UserService } from 'src/user/user.service';

import { CreateCompanyDto, UpdateCompanyDto } from './dto';
import { CompanyEntity } from './entities';
import { CompanyErrorCodes } from './errors';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companiesRepository: Repository<CompanyEntity>,
    private readonly filesService: FilesService,
    private readonly usersService: UserService,
  ) {}

  async create(dto: CreateCompanyDto, image: Express.Multer.File) {
    const logo = await this.filesService.uploadFile(image);

    const owner = await this.usersService.createOwnerUser(dto.ownerEmail);

    const company = this.companiesRepository.create({
      ...dto,
      logo,
      owner,
    });

    return await this.companiesRepository.save(company);
  }

  async findAll(query: PaginateQuery) {
    return await paginate(query, this.companiesRepository, {
      relations: {
        logo: true,
      },
      sortableColumns: ['name'],
    });
  }

  async findOne(id: number) {
    return await this.companiesRepository.findOne({
      relations: {
        logo: true,
        owner: true,
      },
      where: {
        id: id,
      },
    });
  }

  async findOneOrFail(id: number) {
    const company = await this.findOne(id);

    if (!company) {
      throw new NotFoundException(CompanyErrorCodes.CompanyNotFoundError);
    }

    return company;
  }

  async update(user: UserEntity, id: number, dto: UpdateCompanyDto) {
    const company = await this.findOneOrFail(id);

    if (company.owner.id !== user.id) {
      throw new NotFoundException(CompanyErrorCodes.CompanyNotFoundError);
    }

    return await this.companiesRepository.update(id, dto);
  }

  async remove(id: number) {
    return `This action removes a #${id} company`;
  }

  async changeLogo(user: UserEntity, id: number, image: Express.Multer.File) {
    const company = await this.findOneOrFail(id);

    if (company.owner.id !== user.id) {
      throw new NotFoundException(CompanyErrorCodes.CompanyNotFoundError);
    }

    await this.filesService.deleteFile(company.logo);

    const logo = await this.filesService.uploadFile(image);
    company.logo = logo;

    return await this.companiesRepository.save(company);
  }
}
