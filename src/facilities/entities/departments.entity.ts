import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { FacilityDepartments } from '../enums';

import { FacilityEntity } from './facility.entity';

@Entity('department')
export class DepartmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: FacilityDepartments,
    array: false,
    nullable: false,
  })
  type: FacilityDepartments;

  @ManyToOne(() => FacilityEntity, (facility) => facility.departments, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  facility: FacilityEntity;
}
