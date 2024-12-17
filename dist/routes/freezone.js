"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.freezoneRoutes = void 0;
const config_1 = require("@/config");
const controllers_1 = require("@/controllers");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.route(`${config_1.paths.app.freezone}/:id`).get(async (req, res) => {
    await controllers_1.freezoneController.getFreezoneItem(req, res);
});
router.route(config_1.paths.app.freezone).get(async (req, res) => {
    await controllers_1.freezoneController.getFreezoneItems(req, res);
});
router.route(`${config_1.paths.app.freezone}/:id`).patch(async (req, res) => {
    await controllers_1.freezoneController.updateFreezoneItem(req, res);
});
exports.freezoneRoutes = router;
//# sourceMappingURL=freezone.js.map