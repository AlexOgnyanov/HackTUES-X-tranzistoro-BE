import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  ObjectCannedACL,
  PutObjectCommandInput,
  S3,
} from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Upload } from '@aws-sdk/lib-storage';

import { FileEntity } from './entities';

dotenv.config();

@Injectable()
export class FilesService {
  private s3 = new S3({
    credentials: {
      accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
      secretAccessKey: process.env.AMAZON_ACCESS_SECRET,
    },
    region: process.env.AWS_S3_REGION,
  });

  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  private AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;

  async uploadFile(file: Express.Multer.File) {
    const uploadedFile = await this.s3Upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      Date.now() + '_' + file.originalname.replaceAll(' ', '_'),
      file.mimetype,
    );

    return await this.fileRepository.save({
      key: uploadedFile.Key,
      url: uploadedFile.Location,
    });
  }

  async uploadFiles(files: Express.Multer.File[]) {
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        return await this.uploadFile(file);
      }),
    );

    return uploadedFiles;
  }

  async deleteFile(file: FileEntity) {
    await this.fileRepository.delete(file.id);
    const command = new DeleteObjectCommand({
      Bucket: this.AWS_S3_BUCKET,
      Key: file.key,
    });

    return await this.s3.send(command);
  }

  async deleteFiles(files: FileEntity[]) {
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        return await this.deleteFile(file);
      }),
    );

    return uploadedFiles;
  }

  async s3Upload(
    buffer: Buffer,
    bucket: string,
    name: string,
    mimetype: string,
  ) {
    const params: PutObjectCommandInput = {
      Bucket: bucket,
      Key: name,
      Body: buffer,
      ACL: ObjectCannedACL.public_read,
      ContentType: mimetype,
    };

    return await new Upload({
      client: this.s3,
      params,
    }).done();
  }
}
