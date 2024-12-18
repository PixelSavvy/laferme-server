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
<<<<<<< HEAD
      alter: getEnvVar('NODE_ENV') === 'development',
      force: false,
=======
      alter: environment === 'development',
>>>>>>> ef861539364d9e7312cd78a8915e4331e30c48a1
      match: /_dev$/,
    });
    console.log('Database synchronized!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export { connectDB, sequelize };
