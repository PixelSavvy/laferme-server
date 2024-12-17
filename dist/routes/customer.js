"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRoutes = void 0;
const config_1 = require("@/config");
const controllers_1 = require("@/controllers");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.route(config_1.paths.app.customer).post(async (req, res) => {
    await controllers_1.customerController.addCustomer(req, res);
});
router.route(`${config_1.paths.app.customer}/:id`).get(async (req, res) => {
    await controllers_1.customerController.getCustomers(req, res);
});
router.route(config_1.paths.app.customer).get(async (req, res) => {
    await controllers_1.customerController.getCustomer(req, res);
});
router.route(`${config_1.paths.app.customer}/:id`).patch(async (req, res) => {
    await controllers_1.customerController.updateCustomer(req, res);
});
router.route(`${config_1.paths.app.customer}/:id`).delete(async (req, res) => {
    await controllers_1.customerController.deleteCustomer(req, res);
});
exports.customerRoutes = router;
//# sourceMappingURL=customer.js.map