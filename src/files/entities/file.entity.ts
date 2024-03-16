import { CompanyEntity } from 'src/companies/entities';
import { FacilityEntity } from 'src/facilities/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToOne,
  ManyToOne,
} from 'typeorm';

@Entity('file')
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column({
    nullable: true,
  })
  url: string;

  @OneToOne(() => CompanyEntity, (company) => company.logo, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  company: CompanyEntity;

  @OneToOne(() => FacilityEntity, (facility) => facility.thumbnail, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  thumbnail: FacilityEntity;

  @ManyToOne(() => FacilityEntity, (facility) => facility.thumbnail, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  gallery: FacilityEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: string;
}
