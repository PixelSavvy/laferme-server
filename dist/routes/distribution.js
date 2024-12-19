"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.distributionRoutes = void 0;
const _config_1 = require("@config");
const _controllers_1 = require("@controllers");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router
  .route(`${_config_1.paths.app.distribution}/:id`)
  .get(async (req, res) => {
    await _controllers_1.distributionController.getDistributionItem(req, res);
  });
router
  .route(`${_config_1.paths.app.distribution}/:id`)
  .patch(async (req, res) => {
    await _controllers_1.distributionController.updateDistributionItem(
      req,
      res,
    );
  });
router.route(_config_1.paths.app.distribution).get(async (req, res) => {
  await _controllers_1.distributionController.getDistributionItems(req, res);
});
exports.distributionRoutes = router;
//# sourceMappingURL=distribution.js.map
