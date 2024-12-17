"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreezoneItemProduct = void 0;
const lib_1 = require("@/lib");
const sequelize_1 = require("sequelize");
const FreezoneItemProduct = lib_1.sequelize.define('FreezoneItemProduct', {
    freezoneItemId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'FreezoneItems',
            key: 'id',
        },
    },
    productId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Products',
            key: 'id',
        },
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    weight: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    adjustedQuantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    adjustedWeight: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    timestamps: false,
    indexes: [
        {
            fields: ['productId', 'freezoneItemId'],
        },
        {
            fields: ['freezoneItemId'],
        },
        {
            fields: ['productId'],
        },
    ],
});
exports.FreezoneItemProduct = FreezoneItemProduct;
//# sourceMappingURL=freezoneItemProduct.js.map