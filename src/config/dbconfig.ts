import { Options } from 'sequelize';

import { getEnvVar } from '@helpers';

interface DbConfig {
  [key: string]: Options;
}
export const dbConfig: DbConfig = {
  development: {
    dialect: 'postgres',
    host: getEnvVar('DB_HOST'),
    port: Number(getEnvVar('DB_PORT', '5432')),
    username: getEnvVar('DB_USER'),
    password: getEnvVar('DB_PASSWORD'),
    database: getEnvVar('DB_NAME'),
    logging: false,
    schema: getEnvVar('DB_SCHEMA', 'operations'),
  },
  production: {
    dialect: 'postgres',
    host: getEnvVar('DB_HOST'),
    port: Number(getEnvVar('DB_PORT', '5432')),
    username: getEnvVar('DB_USER'),
    password: getEnvVar('DB_PASSWORD'),
    database: getEnvVar('DB_NAME'),
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
    schema: getEnvVar('DB_SCHEMA', 'operations'),
  },
};
