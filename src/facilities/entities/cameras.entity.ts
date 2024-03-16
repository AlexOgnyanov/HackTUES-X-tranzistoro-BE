import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

import { DepartmentEntity } from './departments.entity';
import { AttendanceEntity } from './attendance.entity';

@Entity('camera')
export class CameraEntity {
  @PrimaryColumn({
    unique: true,
  })
  id: number;

  @ManyToOne(() => DepartmentEntity, (department) => department.cameras, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  department: DepartmentEntity;

  @OneToMany(() => AttendanceEntity, (attendance) => attendance.camera, {
    cascade: true,
  })
  attendance: AttendanceEntity[];
}
