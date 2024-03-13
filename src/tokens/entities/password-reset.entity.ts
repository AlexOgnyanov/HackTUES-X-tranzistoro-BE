import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { UserEntity } from '../../user/entities/user.entity';

@Entity('password_reset_token')
export class PasswordResetTokenEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  token: string;

  @ManyToOne(() => UserEntity, (user) => user.passwordResetTokens, {
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
