import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilesService } from 'src/files/files.service';
import { PaginateQuery, paginate } from 'nestjs-paginate';

import {
  CreateCameraDto,
  CreateDepartmentDto,
  CreateFacilityDto,
  UpdateDepartmentDto,
  UpdateFacilityDto,
} from './dto';
import { DepartmentEntity, FacilityEntity } from './entities';
import { FacilityErrorCodes } from './errors';
import { FacilityDepartments, FacilityTags } from './enums';
import { CameraEntity } from './entities/cameras.entity';

@Injectable()
export class FacilitiesService {
  constructor(
    @InjectRepository(FacilityEntity)
    private readonly facilitiesRepository: Repository<FacilityEntity>,
    @InjectRepository(DepartmentEntity)
    private readonly departmentsRepository: Repository<DepartmentEntity>,
    @InjectRepository(CameraEntity)
    private readonly camerasRepository: Repository<CameraEntity>,
    private readonly filesService: FilesService,
  ) {}

  async create(
    dto: CreateFacilityDto,
    files: {
      thumbnail?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
  ) {
    if (files.thumbnail.length > 1 || files.thumbnail.length === 0) {
      throw new BadRequestException(
        FacilityErrorCodes.ExactlyOneThumbnailError,
      );
    }

    if (files.gallery.length < 2) {
      throw new BadRequestException(
        FacilityErrorCodes.NotEnoughGalleryImagesError,
      );
    }

    const thumbnail = await this.filesService.uploadFile(files.thumbnail[0]);
    const gallery = await this.filesService.uploadFiles(files.gallery);

    if (typeof dto.tags === 'string') {
      dto.tags = [dto.tags];
    }

    const facility = this.facilitiesRepository.create({
      ...dto,
      thumbnail,
      gallery,
      tags: dto.tags,
    });

    return await this.facilitiesRepository.save(facility);
  }

  async findAll(query: PaginateQuery) {
    return paginate(query, this.facilitiesRepository, {
      relations: {
        thumbnail: true,
        gallery: true,
      },
      sortableColumns: ['name'],
    });
  }

  async findOne(id: number) {
    return await this.facilitiesRepository.findOne({
      relations: {
        thumbnail: true,
        gallery: true,
        departments: true,
      },
      where: {
        id,
      },
    });
  }

  async findOneOrFail(id: number) {
    const facility = await this.findOne(id);

    if (!facility) {
      throw new NotFoundException(FacilityErrorCodes.FacilityNotFoundError);
    }

    return facility;
  }

  async update(id: number, dto: UpdateFacilityDto) {
    const facility = await this.findOneOrFail(id);

    return await this.facilitiesRepository.save({
      ...facility,
      ...dto,
    });
  }

  async remove(id: number) {
    const facility = await this.findOneOrFail(id);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.filesService.deleteFile(facility.thumbnail);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.filesService.deleteFiles(facility.gallery);

    return await this.facilitiesRepository.remove(facility);
  }

  getTags() {
    return Object.values(FacilityTags);
  }

  getDepartments() {
    return Object.values(FacilityDepartments);
  }

  async findOneDepartment(id: number) {
    return await this.departmentsRepository.findOne({
      relations: {
        facility: true,
      },
      where: {
        id,
      },
    });
  }

  async findOneDepartmentOrFail(id: number) {
    const facility = await this.findOneDepartment(id);

    if (!facility) {
      throw new NotFoundException(FacilityErrorCodes.DepartmentNotFoundError);
    }

    return facility;
  }

  async createDepartment(dto: CreateDepartmentDto) {
    const department = this.departmentsRepository.create({
      name: dto.name,
      type: dto.type,
      facility: {
        id: dto.facilityId,
      },
    });

    return await this.departmentsRepository.save(department);
  }

  async updateDepartment(id: number, dto: UpdateDepartmentDto) {
    const department = await this.findOneDepartmentOrFail(id);

    return await this.departmentsRepository.save({
      ...department,
      ...dto,
    });
  }

  async removeDepartment(id: number) {
    const department = await this.findOneDepartmentOrFail(id);

    return await this.departmentsRepository.remove(department);
  }

  async createCamera(dto: CreateCameraDto) {
    const camera = this.camerasRepository.create({
      id: dto.cameraId,
      department: {
        id: dto.departmentId,
      },
    });

    return await this.camerasRepository.save(camera);
  }
}
