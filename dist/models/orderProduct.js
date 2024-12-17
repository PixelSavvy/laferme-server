"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderProduct = void 0;
const lib_1 = require("@/lib");
const sequelize_1 = require("sequelize");
const OrderProduct = lib_1.sequelize.define('OrderProduct', {
    orderId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Orders',
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
}, {
    timestamps: false,
    indexes: [
        {
            fields: ['orderId', 'productId'],
        },
        {
            fields: ['orderId'],
        },
        {
            fields: ['productId'],
        },
    ],
});
exports.OrderProduct = OrderProduct;
//# sourceMappingURL=orderProduct.js.map