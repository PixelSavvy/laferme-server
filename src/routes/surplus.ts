import express from "express";
import asyncHandler from "express-async-handler";

import { paths } from "@/config";
import { surplusController } from "@/controllers";
import { validator } from "@/middlewares";
import { surplusSchema } from "@/validators";

const router = express.Router();

router.route(paths.app.surplus).post(validator.validateRequestBody(surplusSchema), asyncHandler(surplusController.addOne));

router.route(paths.app.surplus).get(asyncHandler(surplusController.getAll));

export const surplusRoutes = router;
