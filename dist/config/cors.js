"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const origins_1 = require("./origins");
exports.corsOptions = {
    origin: (origin, callback) => {
        if (!origin || origins_1.allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow credentials (cookies, etc.)
    optionsSuccessStatus: 200, // For legacy browser support
};
//# sourceMappingURL=cors.js.map