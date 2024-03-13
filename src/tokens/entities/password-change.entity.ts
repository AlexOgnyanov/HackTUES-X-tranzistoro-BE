import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { UserEntity } from '../../user/entities/user.entity';

@Entity('password_change_token')
export class PasswordChangeTokenEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  token: string;

  @ManyToOne(() => UserEntity, (user) => user.passwordChangeTokens, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
