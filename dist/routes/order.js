'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.orderRoutes = void 0;
const _config_1 = require('@config');
const _controllers_1 = require('@controllers');
const express_1 = __importDefault(require('express'));
const router = express_1.default.Router();
router.route(_config_1.paths.app.order).post(async (req, res) => {
  await _controllers_1.orderController.addOrder(req, res);
});
router.route(`${_config_1.paths.app.order}/:id`).get(async (req, res) => {
  await _controllers_1.orderController.getOrder(req, res);
});
router.route(`${_config_1.paths.app.order}/:id`).delete(async (req, res) => {
  await _controllers_1.orderController.deleteOrder(req, res);
});
router.route(_config_1.paths.app.order).get(async (req, res) => {
  await _controllers_1.orderController.getOrders(req, res);
});
router.route(`${_config_1.paths.app.order}/:id`).patch(async (req, res) => {
  await _controllers_1.orderController.updateOrder(req, res);
});
exports.orderRoutes = router;
//# sourceMappingURL=order.js.map
