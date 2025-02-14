import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { corsOptions, paths } from "@/config";
import { getEnvVar } from "@/helpers";
import { connectDB } from "@/lib";

import { limiter } from "@/middlewares";
import passport from "@/passport";
import {
  authRoutes,
  customerRoutes,
  employeesRoutes,
  excelRoutes,
  orderRoutes,
  productRoutes,
  surplusRoutes,
} from "@/routes";

const PORT = getEnvVar("PORT");
const NODE_ENV = getEnvVar("NODE_ENV") || "development";
const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(passport.initialize());
app.use(compression());

// Limiter
app.use(limiter);

// Public routes
app.use(paths.root, authRoutes);

// Protected routes
app.use(paths.protected, passport.authenticate("jwt", { session: false }));

app.use(paths.protected, productRoutes);
app.use(paths.protected, customerRoutes);
app.use(paths.protected, orderRoutes);
app.use(paths.protected, excelRoutes);
app.use(paths.protected, surplusRoutes);

app.use(paths.protected, employeesRoutes);

app.listen(PORT, async () => {
  console.log(`Server is running on PORT ${PORT} in ${NODE_ENV.toUpperCase()} mode`);
  await connectDB();
});
