import express from "express";
import asyncHandler from "express-async-handler";

import { paths } from "@/config";
import { productController } from "@/controllers";
import { validator } from "@/middlewares";
import { productSchema } from "@/validators";

const router = express.Router();

router
  .route(paths.app.product)
  .post(validator.validateRequestBody(productSchema.omit({ id: true })), asyncHandler(productController.addOne));

router
  .route(paths.app.product + "/:id")
  .get(validator.validateRequestParams(productSchema.pick({ id: true })), asyncHandler(productController.getOne));

router.route(paths.app.product).get(asyncHandler(productController.getAll));

router
  .route(paths.app.product + "/:id")
  .delete(validator.validateRequestParams(productSchema.pick({ id: true })), asyncHandler(productController.deleteOne));

router
  .route(paths.app.product + "/:id")
  .put(
    validator.validateRequestParams(productSchema.pick({ id: true })),
    validator.validateRequestBody(productSchema),
    asyncHandler(productController.updateOne)
  );

export const productRoutes = router;
