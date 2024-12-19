"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const _config_1 = require("@config");
const _lib_1 = require("@lib");
const _routes_1 = require("@routes");
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)(_config_1.corsOptions));
app.use((0, cookie_parser_1.default)());
// routes
app.use(_config_1.paths.root, _routes_1.productRoutes);
app.use(_config_1.paths.root, _routes_1.customerRoutes);
app.use(_config_1.paths.root, _routes_1.orderRoutes);
app.use(_config_1.paths.root, _routes_1.freezoneRoutes);
app.use(_config_1.paths.root, _routes_1.distributionRoutes);
app.listen(PORT, async () => {
  console.log(
    `Server is running on PORT ${PORT} on an ${NODE_ENV.toUpperCase()} environment`,
  );
  await (0, _lib_1.connectDB)();
});
//# sourceMappingURL=server.js.map
