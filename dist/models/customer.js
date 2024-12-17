"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const sequelize_1 = require("sequelize");
const lib_1 = require("@/lib");
const config_1 = require("@/config");
const validations_1 = require("@/validations");
const PAYMENT_OPTIONS = Object.values(config_1.paymentOptions);
const PRICE_INDEXES = Object.values(config_1.priceIndex);
const customerSchema = validations_1.customerSchema.omit({
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});
const Customer = lib_1.sequelize.define('Customer', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    needInvoice: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    priceIndex: {
        type: sequelize_1.DataTypes.ENUM(...PRICE_INDEXES),
        allowNull: false,
    },
    paymentOption: {
        type: sequelize_1.DataTypes.ENUM(...PAYMENT_OPTIONS),
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
    paranoid: true,
    indexes: [
        {
            fields: ['id'],
        },
        {
            fields: ['email'],
        },
    ],
});
exports.Customer = Customer;
//# sourceMappingURL=customer.js.map