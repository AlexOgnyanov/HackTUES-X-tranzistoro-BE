import {
  Entity,
  Column,
  Unique,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissionAction, PermissionObject } from 'src/permissions/enums';
import { RoleEntity } from 'src/roles/entities';

@Entity('permission')
@Unique(['action', 'object'])
export class PermissionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    enum: PermissionAction,
  })
  action: PermissionAction;

  @Column({
    enum: PermissionObject,
  })
  object: PermissionObject;

  @ManyToMany(() => RoleEntity, (role) => role.permissions, {
    onDelete: 'CASCADE',
  })
  roles?: RoleEntity[];
}
