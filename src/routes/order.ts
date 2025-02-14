import express from "express";
import asyncHandler from "express-async-handler";

import { paths } from "@/config";
import { orderController } from "@/controllers";
import { validator } from "@/middlewares";
import { orderSchema } from "@/validators";

const router = express.Router();

router
  .route(paths.app.order)
  .post(validator.validateRequestBody(orderSchema.omit({ id: true })), asyncHandler(orderController.addOne));

router
  .route(paths.app.order + "/:id")
  .get(validator.validateRequestParams(orderSchema.pick({ id: true })), asyncHandler(orderController.getOne));

router.route(paths.app.order).get(asyncHandler(orderController.getAll));

router
  .route(paths.app.order + "/:id")
  .delete(validator.validateRequestParams(orderSchema.pick({ id: true })), asyncHandler(orderController.deleteOne));

router
  .route(paths.app.order + "/:id")
  .put(
    validator.validateRequestParams(orderSchema.pick({ id: true })),
    validator.validateRequestBody(orderSchema),
    asyncHandler(orderController.updateOne)
  );

export const orderRoutes = router;
