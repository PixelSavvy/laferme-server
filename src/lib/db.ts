import { dbConfig } from '@config';
import { getEnvVar } from '@helpers';
import 'dotenv/config';

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(getEnvVar('DB_URL'), dbConfig);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected!');
    await sequelize.query(`CREATE SCHEMA IF NOT EXISTS operations`);
    await sequelize.sync({
      alter: getEnvVar('NODE_ENV') === 'development',
      force: false,
      match: /_stage$/,
    });
    console.log('Database synchronized!');
  } catch (error) {
    console.error('Unable to connect to database:', error);
    process.exit(1);
  }
};

export { connectDB, sequelize };
