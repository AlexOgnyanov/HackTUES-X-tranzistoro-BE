import { FileEntity } from 'src/files/entities';
import { UserEntity } from 'src/user/entities';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('company')
export class CompanyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => UserEntity, (user) => user.company)
  owner: UserEntity;

  @OneToOne(() => FileEntity, (file) => file.company)
  @JoinColumn()
  logo: FileEntity;
}
