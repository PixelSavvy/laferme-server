import 'dotenv/config';

import { Config, dbConfig } from '@config';
import { Sequelize } from 'sequelize';

// Determine the environment
const environment = process.env.NODE_ENV || 'development';
const configEnv = dbConfig[environment as keyof Config];

const sequelize = new Sequelize(configEnv.database!, configEnv.username!, configEnv.password!, {
  host: configEnv.host,
  port: parseInt(configEnv.port || '5432', 10),
  dialect: 'postgres',
  schema: configEnv.schema,
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected!');
    await sequelize.query(`CREATE SCHEMA IF NOT EXISTS operations`);
    await sequelize.sync({ alter: true, force: false, match: /_dev$/ });
    console.log('Database synchronized!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export { connectDB, sequelize };
