import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilesService } from 'src/files/files.service';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/user/entities';

import {
  AddAttendanceDto,
  CreateCameraDto,
  CreateDepartmentDto,
  CreateFacilityDto,
  GetFacilitiesGridDto,
  GetFacilitiesMapDto,
  UpdateDepartmentDto,
  UpdateFacilityDto,
} from './dto';
import {
  AttendanceEntity,
  CameraEntity,
  DepartmentEntity,
  FacilityEntity,
} from './entities';
import { FacilityErrorCodes } from './errors';
import { FacilityDepartments, FacilityTags } from './enums';

@Injectable()
export class FacilitiesService {
  constructor(
    @InjectRepository(FacilityEntity)
    private readonly facilitiesRepository: Repository<FacilityEntity>,
    @InjectRepository(DepartmentEntity)
    private readonly departmentsRepository: Repository<DepartmentEntity>,
    @InjectRepository(CameraEntity)
    private readonly camerasRepository: Repository<CameraEntity>,
    @InjectRepository(AttendanceEntity)
    private readonly attendancesRepository: Repository<AttendanceEntity>,
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  async create(
    user: UserEntity,
    dto: CreateFacilityDto,
    files: {
      thumbnail?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    },
  ) {
    if (!user?.company?.id) {
      throw new ForbiddenException(FacilityErrorCodes.OnlyCompanyUsersError);
    }

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
      company: {
        id: user.company.id,
      },
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

  async findOneCamera(id: number) {
    return await this.camerasRepository.findOne({
      relations: {
        department: true,
      },
      where: {
        id,
      },
    });
  }

  async findOneCameraOrFail(id: number) {
    const facility = await this.findOneCamera(id);

    if (!facility) {
      throw new NotFoundException(FacilityErrorCodes.CameraNotFoundError);
    }

    return facility;
  }

  async createCamera(dto: CreateCameraDto) {
    if (
      await this.camerasRepository.findOne({
        where: {
          id: dto.cameraId,
        },
      })
    ) {
      throw new BadRequestException(
        FacilityErrorCodes.CameraAlreadyExistsError,
      );
    }

    const department = await this.findOneDepartmentOrFail(dto.departmentId);

    const camera = this.camerasRepository.create({
      id: dto.cameraId,
      department,
    });

    return await this.camerasRepository.save(camera);
  }

  async addAttendance(dto: AddAttendanceDto) {
    if (dto.apiKey !== this.configService.get<string>('CAMERA_API_KEY')) {
      throw new UnauthorizedException(FacilityErrorCodes.UnauthorizedError);
    }

    const camera = await this.findOneCameraOrFail(dto.cameraId);

    const attendance = this.attendancesRepository.create({
      camera,
      count: dto.count,
    });

    return await this.attendancesRepository.save(attendance);
  }

  async getFacilitiesGrid(dto: GetFacilitiesGridDto) {
    const offset = (dto.page - 1) * dto.limit;

    if (typeof dto.tags === 'string') {
      dto.tags = [dto.tags];
    }

    if (typeof dto.departments === 'string') {
      dto.departments = [dto.departments];
    }

    if (typeof dto.companyIds === 'string') {
      dto.companyIds = [dto.companyIds];
    }

    const query = this.facilitiesRepository
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.thumbnail', 'thumbnail')
      .leftJoinAndSelect('f.departments', 'departments')
      .leftJoinAndSelect('f.company', 'company')
      .addSelect(
        `(earth_distance(ll_to_earth(f.lat, f.lon), ll_to_earth(:userLat, :userLon)))`,
        'distance',
      )
      .orderBy('distance', 'ASC')
      .setParameters({ userLat: dto.userLat, userLon: dto.userLon })
      .offset(offset)
      .limit(dto.limit);

    if (dto?.tags && dto?.tags.length) {
      query.andWhere('f.tags @> ARRAY[:...tags]::facility_tags_enum[]', {
        tags: dto.tags,
      });
    }

    if (dto?.companyIds && dto?.companyIds.length) {
      query.andWhere('f.companyId IN (:...companyIds)', {
        companyIds: dto.companyIds,
      });
    }

    if (dto?.departments && dto?.departments.length) {
      query
        .andWhere('departments.type IN (:...departments)', {
          departments: dto.departments,
        })
        .groupBy('f.id')
        .addGroupBy('thumbnail.id')
        .addGroupBy('departments.id')
        .addGroupBy('company.id')
        .having('COUNT(departments.id) = :departmentCount', {
          departmentCount: dto.departments.length,
        });
    }

    return await query.getMany();
  }

  async getFacilitiesMap(dto: GetFacilitiesMapDto) {
    if (typeof dto.tags === 'string') {
      dto.tags = [dto.tags];
    }

    if (typeof dto.departments === 'string') {
      dto.departments = [dto.departments];
    }

    if (typeof dto.companyIds === 'string') {
      dto.companyIds = [dto.companyIds];
    }

    const [top, bottom] = [dto.corner1Lat, dto.corner2Lat].sort();
    const [left, right] = [dto.corner1Lon, dto.corner2Lon].sort();

    const query = this.facilitiesRepository
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.thumbnail', 'thumbnail')
      .leftJoinAndSelect('f.departments', 'departments')
      .leftJoinAndSelect('f.company', 'company')
      .andWhere('f.lat BETWEEN :top AND :bottom', { top, bottom })
      .andWhere('f.lon BETWEEN :left AND :right', { left, right });

    if (dto?.tags && dto?.tags.length) {
      query.andWhere('f.tags @> ARRAY[:...tags]::facility_tags_enum[]', {
        tags: dto.tags,
      });
    }

    if (dto?.companyIds && dto?.companyIds.length) {
      query.andWhere('f.companyId IN (:...companyIds)', {
        companyIds: dto.companyIds,
      });
    }

    if (dto?.departments && dto?.departments.length) {
      query
        .andWhere('departments.type IN (:...departments)', {
          departments: dto.departments,
        })
        .groupBy('f.id')
        .addGroupBy('thumbnail.id')
        .addGroupBy('departments.id')
        .addGroupBy('company.id')
        .having('COUNT(departments.id) = :departmentCount', {
          departmentCount: dto.departments.length,
        });
    }

    return await query.getMany();
  }
}
