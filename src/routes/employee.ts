import express from "express";
import asyncHandler from "express-async-handler";

import { paths } from "@/config";
import { employeeController } from "@/controllers";
import { validator } from "@/middlewares";
import { employeeSchema } from "@/validators";

const router = express.Router();

router
  .route(paths.app.employee)
  .post(validator.validateRequestBody(employeeSchema.omit({ id: true })), asyncHandler(employeeController.addOne));

router.route(paths.app.employee).get(asyncHandler(employeeController.getAll));

export const employeesRoutes = router;
