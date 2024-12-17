"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.connectDB = void 0;
require("dotenv/config");
const _config_1 = require("@config");
const sequelize_1 = require("sequelize");
// Determine the environment
const environment = process.env.NODE_ENV || 'development';
const configEnv = _config_1.dbConfig[environment];
const sequelize = new sequelize_1.Sequelize(process.env.DB_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    schema: configEnv.schema,
    logging: false,
});
exports.sequelize = sequelize;
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected!');
        await sequelize.query(`CREATE SCHEMA IF NOT EXISTS operations`);
        await sequelize.sync({ alter: true, force: false, match: /_dev$/ });
        console.log('Database synchronized!');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map