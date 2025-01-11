import { dbConfig } from "@/config";
import { getEnvVar } from "@/helpers";
import "dotenv/config";

import { Sequelize } from "sequelize";

const environment = getEnvVar("NODE_ENV") as "development" | "production";
const config = dbConfig[environment];

const sequelize = new Sequelize({
  ...config,
  dialect: "postgres",
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Successfully connected to the database!");
    await sequelize.query(`CREATE SCHEMA IF NOT EXISTS operations`);

    await sequelize.sync({
      alter: true,
      force: false,
      match: environment === "development" ? /_dev$/ : /_dev_u8ny$/,
    });

    await sequelize.sync();

    console.log("Database synchronized!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

export { connectDB, sequelize };
