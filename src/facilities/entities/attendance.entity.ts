import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CameraEntity } from './cameras.entity';

@Entity('attendance')
export class AttendanceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  count: number;

  @ManyToOne(() => CameraEntity, (camera) => camera.attendance, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  camera: CameraEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: string;
}
