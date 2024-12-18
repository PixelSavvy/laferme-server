"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.connectDB = void 0;
const _config_1 = require("@config");
const _helpers_1 = require("@helpers");
require("dotenv/config");
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize((0, _helpers_1.getEnvVar)('DB_URL'), _config_1.dbConfig);
exports.sequelize = sequelize;
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected!');
        await sequelize.query(`CREATE SCHEMA IF NOT EXISTS operations`);
        await sequelize.sync({
            alter: (0, _helpers_1.getEnvVar)('NODE_ENV') === 'development',
            force: false,
            match: /_dev$/,
        });
        console.log('Database synchronized!');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map