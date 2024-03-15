import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { DepartmentEntity } from './departments.entity';

@Entity('camera')
export class CameraEntity {
  @PrimaryColumn()
  id: number;

  @ManyToOne(() => DepartmentEntity, (department) => department.cameras, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  department: DepartmentEntity;
}
