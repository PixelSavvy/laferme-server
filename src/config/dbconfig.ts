import { Options } from "sequelize";

import { getEnvVar } from "@/helpers";

const development: Options = {
  host: getEnvVar("DB_HOST"),
  database: getEnvVar("DB_NAME"),
  username: getEnvVar("DB_USER"),
  password: getEnvVar("DB_PASS"),
  port: Number(getEnvVar("DB_PORT")),
  schema: getEnvVar("DB_SCHEMA"),
  logging: false,
};

const production: Options = {
  host: getEnvVar("DB_HOST"),
  database: getEnvVar("DB_NAME"),
  username: getEnvVar("DB_USER"),
  password: getEnvVar("DB_PASS"),
  port: Number(getEnvVar("DB_PORT")),
  schema: getEnvVar("DB_SCHEMA"),
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
};

export const dbConfig = {
  development,
  production,
};
