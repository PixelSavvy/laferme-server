import { Options } from 'sequelize';

import { getEnvVar } from '@helpers';

interface DbConfig {
  [key: string]: Options;
}
export const dbConfig: Options = {
  dialect: 'postgres',
  port: Number(getEnvVar('DB_PORT', '5432')),
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
  schema: getEnvVar('DB_SCHEMA', 'operations'),
};
