import { FacilityEntity } from 'src/facilities/entities';
import { FileEntity } from 'src/files/entities';
import { UserEntity } from 'src/user/entities';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
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

  @OneToMany(() => FacilityEntity, (facility) => facility.company)
  @JoinColumn()
  facilities: FacilityEntity[];
}
