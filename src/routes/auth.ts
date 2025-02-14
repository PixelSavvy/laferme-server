import express from "express";
import asyncHandler from "express-async-handler";

import { paths } from "@/config";
import { authController } from "@/controllers";
import { validator } from "@/middlewares";
import { loginSchema, registerSchema } from "@/validators";

const router = express.Router();

// /api/auth/register
router
  .route(paths.auth.register)
  .post(validator.validateRequestBody(registerSchema), asyncHandler(authController.register));

// /api/auth/login
router.route(paths.auth.login).post(validator.validateRequestBody(loginSchema), asyncHandler(authController.login));

// /api/auth/me
router.route(paths.auth.me).get(asyncHandler(authController.me));

export const authRoutes = router;
