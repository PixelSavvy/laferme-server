"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const _lib_1 = require("@lib");
const sequelize_1 = require("sequelize");
const Product = _lib_1.sequelize.define('Product', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    productCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    hasVAT: {
        type: sequelize_1.DataTypes.ENUM('0', '1'),
        allowNull: false,
    },
    prices: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
    },
}, {
    timestamps: false,
    indexes: [
        {
            fields: ['id'],
        },
        {
            fields: ['productCode'],
        },
    ],
});
exports.Product = Product;
//# sourceMappingURL=product.js.map