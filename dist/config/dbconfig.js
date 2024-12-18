'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.dbConfig = void 0;
const _helpers_1 = require('@helpers');
exports.dbConfig = {
  development: {
    dialect: 'postgres',
    host: (0, _helpers_1.getEnvVar)('DB_HOST'),
    port: Number((0, _helpers_1.getEnvVar)('DB_PORT', '5432')),
    username: (0, _helpers_1.getEnvVar)('DB_USER'),
    password: (0, _helpers_1.getEnvVar)('DB_PASSWORD'),
    database: (0, _helpers_1.getEnvVar)('DB_NAME'),
    logging: false,
    schema: (0, _helpers_1.getEnvVar)('DB_SCHEMA', 'operations'),
  },
  production: {
    dialect: 'postgres',
    host: (0, _helpers_1.getEnvVar)('DB_HOST'),
    port: Number((0, _helpers_1.getEnvVar)('DB_PORT', '5432')),
    username: (0, _helpers_1.getEnvVar)('DB_USER'),
    password: (0, _helpers_1.getEnvVar)('DB_PASSWORD'),
    database: (0, _helpers_1.getEnvVar)('DB_NAME'),
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
    schema: (0, _helpers_1.getEnvVar)('DB_SCHEMA', 'operations'),
  },
};
//# sourceMappingURL=dbconfig.js.map
