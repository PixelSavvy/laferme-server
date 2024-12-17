"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistributionItem = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("@/config");
const lib_1 = require("@/lib");
const validations_1 = require("@/validations");
const distributionItemSchema = validations_1.distributionItemSchema.omit({ products: true, createdAt: true, updatedAt: true, deletedAt: true });
const DISTRIBUTION_ITEM_STATUS = Object.values(config_1.distributionStatus);
const DistributionItem = lib_1.sequelize.define('DistributionItem', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    freezoneItemId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Orders',
            key: 'id',
        },
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...DISTRIBUTION_ITEM_STATUS),
        allowNull: false,
        defaultValue: DISTRIBUTION_ITEM_STATUS[0],
    },
}, {
    timestamps: true,
    paranoid: true,
    indexes: [
        {
            fields: ['id'],
        },
        {
            fields: ['freezoneItemId'],
        },
    ],
});
exports.DistributionItem = DistributionItem;
//# sourceMappingURL=distributionItem.js.map