import { dbConfig } from "@/config";
import { getEnvVar } from "@/helpers";
import "dotenv/config";

import { Sequelize } from "sequelize";

const environment = getEnvVar("NODE_ENV") as "development" | "production";
const config = dbConfig[environment];

// Retry connection function
const tryConnecting = async (sequelize: Sequelize) => {
  let attempts = 0;
  const maxAttempts = 5;
  const delay = 2000; // 2 seconds

  while (attempts < maxAttempts) {
    try {
      await sequelize.authenticate(); // Check the connection
      console.log("Connection has been established successfully.");
      return; // Exit the function once connection is successful
    } catch (error) {
      if (attempts === maxAttempts - 1) {
        console.error("Failed to connect after multiple attempts:", error);
        throw error; // After the last attempt, throw the error
      }
      attempts++;
      console.log(`Retrying connection... Attempt ${attempts}`);
      await new Promise((resolve) => setTimeout(resolve, delay)); // Wait for 2 seconds before retrying
    }
  }
};

const sequelize = new Sequelize({
  ...config,
  dialect: "postgres",
});

const connectDB = async () => {
  try {
    await tryConnecting(sequelize); // Use the retry logic here
    console.log("Successfully connected to the database!");
    await sequelize.query(`CREATE SCHEMA IF NOT EXISTS operations`);

    await sequelize.sync({
      alter: true,
      force: false,
      match: environment === "development" ? /_dev$/ : undefined,
    });

    await sequelize.sync();

    console.log("Database synchronized!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

export { connectDB, sequelize };
