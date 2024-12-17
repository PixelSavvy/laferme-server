"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("module-alias/register");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = require("@/config");
const lib_1 = require("@/lib");
const routes_1 = require("@/routes");
const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || 'development';
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)(config_1.corsOptions));
app.use((0, cookie_parser_1.default)());
// routes
app.use(config_1.paths.root, routes_1.productRoutes);
app.use(config_1.paths.root, routes_1.customerRoutes);
app.use(config_1.paths.root, routes_1.orderRoutes);
app.use(config_1.paths.root, routes_1.freezoneRoutes);
app.use(config_1.paths.root, routes_1.distributionRoutes);
app.listen(PORT, async () => {
    console.log(`Server is running on PORT ${PORT} on an ${NODE_ENV.toUpperCase()} environment`);
    await (0, lib_1.connectDB)();
});
//# sourceMappingURL=server.js.map