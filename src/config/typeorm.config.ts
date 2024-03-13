import { ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleOptions,
  TypeOrmModuleAsyncOptions,
} from '@nestjs/typeorm';
import { SessionSubscriber } from 'src/auth/entities';
import { UserSubscriber } from 'src/user/entities/user-entity.subscriber';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    type: 'postgres',
    logging: configService.get<string>('DATABASE_LOGGING') === 'true',
    synchronize: false,
    migrationsTableName: 'migrations',
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    database: configService.get<string>('DATABASE_NAME'),
    username: configService.get<string>('DATABASE_USER'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    migrations: [__dirname + '/../migrations/*.ts'],
    entities: [__dirname + '/../**/entities/*.entity{.ts,.js}'],
    subscribers: [UserSubscriber, SessionSubscriber],
  }),
  inject: [ConfigService],
};
