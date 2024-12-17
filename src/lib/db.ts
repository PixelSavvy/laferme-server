import 'dotenv/config';

import { dbConfig } from '@config';
import { getEnvVar } from '@helpers';
import { Sequelize } from 'sequelize';

// Determine the environment
const environment = getEnvVar('NODE_ENV', 'development');
const config = dbConfig[environment];

const sequelize = new Sequelize(config);

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

export { connectDB, sequelize };
