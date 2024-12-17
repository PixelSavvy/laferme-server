export interface DbConfig {
  username: string | undefined;
  password: string | undefined;
  database: string | undefined;
  host: string | undefined;
  port: string | undefined;
  schema: string | undefined;
}

export interface Config {
  development: DbConfig;
  production: DbConfig;
}
export const dbConfig: Config = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    schema: process.env.DB_SCHEMA,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    schema: process.env.DB_SCHEMA,
  },
};
