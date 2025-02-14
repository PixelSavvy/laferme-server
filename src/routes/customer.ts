import express from "express";
import asyncHandler from "express-async-handler";

import { paths } from "@/config";
import { customerController } from "@/controllers";
import { validator } from "@/middlewares";
import { customerSchema } from "@/validators";

const router = express.Router();

router
  .route(paths.app.customer)
  .post(validator.validateRequestBody(customerSchema.omit({ id: true })), asyncHandler(customerController.addOne));

router.route(paths.app.customer + "/:id").get(asyncHandler(customerController.getOne));
router.route(paths.app.customer).get(asyncHandler(customerController.getAll));

router
  .route(paths.app.customer + "/:id")
  .delete(validator.validateRequestParams(customerSchema.pick({ id: true })), asyncHandler(customerController.deleteOne));

router
  .route(paths.app.customer + "/:id")
  .put(
    validator.validateRequestParams(customerSchema.pick({ id: true })),
    validator.validateRequestBody(customerSchema),
    asyncHandler(customerController.updateOne)
  );

export const customerRoutes = router;
