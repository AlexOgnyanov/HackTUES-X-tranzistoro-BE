import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

const connectDB = new DataSource({
  type: 'postgres',
  logging: process.env.DATABASE_LOGGING === 'true',
  synchronize: false,
  migrationsTableName: 'migrations',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  migrations: [__dirname + '/../migrations/*.ts'],
  entities: [__dirname + '/../**/entities/*.entity{.ts,.js}'],
});

export default connectDB;
