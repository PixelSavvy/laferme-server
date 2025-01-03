import cors from "cors";
import express from "express";

import cookieParser from "cookie-parser";

import compression from "compression";

import { corsOptions, paths } from "@/config";
import { connectDB } from "@/lib";
import { customerRoutes, distributionRoutes, freezoneRoutes, orderRoutes, productRoutes } from "@/routes";
import { getEnvVar } from "./helpers";

const PORT = getEnvVar("PORT");
const NODE_ENV = getEnvVar("NODE_ENV") || "development";
const app = express();

app.use(express.json());

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(compression());

// routes
app.use(paths.root, productRoutes);
app.use(paths.root, customerRoutes);
app.use(paths.root, orderRoutes);
app.use(paths.root, freezoneRoutes);
app.use(paths.root, distributionRoutes);

app.listen(PORT, async () => {
  console.log(`Server is running on PORT ${PORT} on a ${NODE_ENV.toUpperCase()} environment`);

  await connectDB();
});
