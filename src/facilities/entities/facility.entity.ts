import { FileEntity } from 'src/files/entities';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('facility')
export class FacilityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal', {
    nullable: true,
  })
  lat: number;

  @Column('decimal', {
    nullable: true,
  })
  lon: number;

  @Column({
    nullable: true,
  })
  streetName: string;

  @OneToOne(() => FileEntity, (file) => file.thumbnail)
  @JoinColumn()
  thumbnail: FileEntity;

  @OneToMany(() => FileEntity, (file) => file.gallery)
  @JoinColumn()
  gallery: FileEntity[];
}
