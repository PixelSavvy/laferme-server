"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreezoneItem = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("@/config");
const lib_1 = require("@/lib");
const validations_1 = require("@/validations");
const freezoneItemSchema = validations_1.freezoneItemSchema.omit({ products: true, createdAt: true, updatedAt: true, deletedAt: true });
const FREEZONE_ITEM_STATUS = Object.values(config_1.orderStatus);
const FreezoneItem = lib_1.sequelize.define('FreezoneItem', {
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
        type: sequelize_1.DataTypes.ENUM(...FREEZONE_ITEM_STATUS),
        allowNull: false,
        defaultValue: FREEZONE_ITEM_STATUS[0],
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