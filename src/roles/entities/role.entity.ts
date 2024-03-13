import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { UserEntity } from 'src/user/entities';
import { PermissionEntity } from 'src/permissions/entities';

@Entity('role')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => PermissionEntity, (permission) => permission.roles, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinTable()
  permissions?: PermissionEntity[];

  @OneToMany(() => UserEntity, (user) => user.role)
  users?: UserEntity[];
}
