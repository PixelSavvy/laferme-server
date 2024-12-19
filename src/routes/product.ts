import { paths } from "@config";
import { productController } from "@controllers";
import express from "express";

const router = express.Router();

router.route(paths.app.product).post(async (req, res) => {
  await productController.addProduct(req, res);
});

router.route(paths.app.product).get(async (req, res) => {
  await productController.getProducts(req, res);
});

router.route(`${paths.app.product}/:id`).delete(async (req, res) => {
  await productController.deleteProduct(req, res);
});

router.route(`${paths.app.product}/:id`).patch(async (req, res) => {
  await productController.updateProduct(req, res);
});

router.route(`${paths.app.product}/:id`).get(async (req, res) => {
  await productController.getProduct(req, res);
});

export const productRoutes = router;
