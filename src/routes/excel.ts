import express from "express";
import asyncHandler from "express-async-handler";

import { paths } from "@/config";
import { excelControllers } from "@/controllers";

const router = express.Router();

router.route(paths.excel.product).get(asyncHandler(excelControllers.getProducts));

router.route(paths.excel.customer).get(asyncHandler(excelControllers.getCustomers));
router.route(paths.excel.order).get(asyncHandler(excelControllers.getOrders));
router.route(paths.excel.cleanzone).get(asyncHandler(excelControllers.getCleanzoneItems));
router.route(paths.excel.distribution).get(asyncHandler(excelControllers.getDistributionItems));

export const excelRoutes = router;
