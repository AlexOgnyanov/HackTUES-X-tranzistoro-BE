import { FileEntity } from 'src/files/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CompanyEntity } from 'src/companies/entities';

import { FacilityTags } from '../enums';

import { DepartmentEntity } from './departments.entity';

@Entity('facility')
export class FacilityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal', {
    nullable: true,
  })
  lat: number;

  @Column('decimal', {
    nullable: true,
  })
  lon: number;

  @Column({
    nullable: true,
  })
  streetName: string;

  @Column({
    type: 'enum',
    enum: FacilityTags,
    array: true,
    default: [],
  })
  tags: FacilityTags[];

  @OneToOne(() => FileEntity, (file) => file.thumbnail)
  @JoinColumn()
  thumbnail: FileEntity;

  @OneToMany(() => FileEntity, (file) => file.gallery)
  @JoinColumn()
  gallery: FileEntity[];

  @ManyToOne(() => CompanyEntity, (company) => company.facilities, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  company: CompanyEntity;

  @OneToMany(() => DepartmentEntity, (department) => department.facility)
  @JoinColumn()
  departments: DepartmentEntity[];
}
