import "dotenv/config";

import cors from "cors";
import express from "express";

import cookieParser from "cookie-parser";

import { corsOptions, paths } from "@config";
import { connectDB } from "@lib";
import {
  customerRoutes,
  distributionRoutes,
  freezoneRoutes,
  orderRoutes,
  productRoutes,
} from "@routes";

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
const app = express();

app.use(express.json());

app.use(cors(corsOptions));

app.use(cookieParser());

// routes
app.use(paths.root, productRoutes);
app.use(paths.root, customerRoutes);
app.use(paths.root, orderRoutes);
app.use(paths.root, freezoneRoutes);
app.use(paths.root, distributionRoutes);

app.listen(PORT, async () => {
  console.log(
    `Server is running on PORT ${PORT} on an ${NODE_ENV.toUpperCase()} environment`,
  );

  await connectDB();
});
