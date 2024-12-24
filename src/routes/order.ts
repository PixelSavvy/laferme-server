import { paths } from "@/config";
import { orderController } from "@/controllers";
import express from "express";

const router = express.Router();

router.route(paths.app.order).post(async (req, res) => {
  await orderController.addOrder(req, res);
});

router.route(`${paths.app.order}/:id`).get(async (req, res) => {
  await orderController.getOrder(req, res);
});

router.route(`${paths.app.order}/:id`).delete(async (req, res) => {
  await orderController.deleteOrder(req, res);
});

router.route(paths.app.order).get(async (req, res) => {
  await orderController.getOrders(req, res);
});

router.route(`${paths.app.order}/:id`).patch(async (req, res) => {
  await orderController.updateOrder(req, res);
});

router.route(`${paths.app.order}/:id/:status`).patch(async (req, res) => {
  await orderController.updateOrderStatus(req, res);
});

export const orderRoutes = router;
