'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.sequelize = exports.connectDB = void 0;
require('dotenv/config');
const _config_1 = require('@config');
const _helpers_1 = require('@helpers');
const sequelize_1 = require('sequelize');
// Determine the environment
const environment = (0, _helpers_1.getEnvVar)('NODE_ENV', 'development');
const config = _config_1.dbConfig[environment];
const sequelize = new sequelize_1.Sequelize(config);
exports.sequelize = sequelize;
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected!');
    await sequelize.query(`CREATE SCHEMA IF NOT EXISTS operations`);
    await sequelize.sync({
      alter: environment === 'development',
      force: false,
      match: /_dev$/,
    });
    console.log('Database synchronized!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map
