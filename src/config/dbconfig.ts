import { Options } from "sequelize";

import { getEnvVar } from "@/helpers";

const development: Options = {
  host: getEnvVar("DB_HOST", "localhost"),
  database: getEnvVar("DB_NAME", "operations_dev"),
  username: getEnvVar("DB_USER", "postgres"),
  password: getEnvVar("DB_PASS", "postgres"),
  port: Number(getEnvVar("DB_PORT", "5432")),
  schema: getEnvVar("DB_SCHEMA"),
  dialect: "postgres",

  logging: false,
};

const production: Options = {
  schema: getEnvVar("DB_SCHEMA"),
  dialect: "postgres",
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
