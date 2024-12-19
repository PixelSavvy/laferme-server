"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const _config_1 = require("@config");
const _controllers_1 = require("@controllers");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.route(_config_1.paths.app.product).post(async (req, res) => {
  await _controllers_1.productController.addProduct(req, res);
});
router.route(_config_1.paths.app.product).get(async (req, res) => {
  await _controllers_1.productController.getProducts(req, res);
});
router.route(`${_config_1.paths.app.product}/:id`).delete(async (req, res) => {
  await _controllers_1.productController.deleteProduct(req, res);
});
router.route(`${_config_1.paths.app.product}/:id`).patch(async (req, res) => {
  await _controllers_1.productController.updateProduct(req, res);
});
router.route(`${_config_1.paths.app.product}/:id`).get(async (req, res) => {
  await _controllers_1.productController.getProduct(req, res);
});
exports.productRoutes = router;
//# sourceMappingURL=product.js.map
