"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
const _helpers_1 = require("@helpers");
exports.dbConfig = {
    dialect: 'postgres',
    port: Number((0, _helpers_1.getEnvVar)('DB_PORT', '5432')),
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    logging: false,
    schema: (0, _helpers_1.getEnvVar)('DB_SCHEMA', 'operations'),
};
//# sourceMappingURL=dbconfig.js.map