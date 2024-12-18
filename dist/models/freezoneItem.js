"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreezoneItem = void 0;
const sequelize_1 = require("sequelize");
const _config_1 = require("@config");
const _lib_1 = require("@lib");
const _validations_1 = require("@validations");
const freezoneItemSchema = _validations_1.freezoneItemSchema.omit({ products: true, createdAt: true, updatedAt: true, deletedAt: true });
const FreezoneItem = _lib_1.sequelize.define('FreezoneItem', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    orderId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Orders',
            key: 'id',
        },
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(..._config_1.orderStatus),
        allowNull: false,
        defaultValue: _config_1.orderStatus[0],
    },
}, {
    timestamps: true,
    paranoid: true,
    indexes: [
        {
            fields: ['id'],
        },
        {
            fields: ['orderId'],
        },
    ],
});
exports.FreezoneItem = FreezoneItem;
//# sourceMappingURL=freezoneItem.js.map