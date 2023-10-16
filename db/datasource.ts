import { DataSourceOptions } from 'typeorm';
import { User } from '../src/users/entities/user.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  entities: [User],
  migrations: ['migrations/*{.ts,.js}'],
  synchronize: true,
  logging: true,
};
