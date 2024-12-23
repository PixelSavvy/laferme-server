import { dbConfig } from "@/config";
import { getEnvVar } from "@/helpers";
import "dotenv/config";

import { Sequelize } from "sequelize";

const environment = getEnvVar("NODE_ENV") as "development" | "production";
const config = dbConfig[environment];

const sequelize = new Sequelize(getEnvVar("DB_URL"), config);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");
    await sequelize.query(`CREATE SCHEMA IF NOT EXISTS operations`);

    if (getEnvVar("NODE_ENV") === "development") {
      await sequelize.sync({
        alter: getEnvVar("NODE_ENV") === "development",
        force: false,
        match: /_dev$/,
      });
    }

    await sequelize.sync();

    console.log("Database synchronized!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

export { connectDB, sequelize };
