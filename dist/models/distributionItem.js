'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.DistributionItem = void 0;
const sequelize_1 = require('sequelize');
const _lib_1 = require('@lib');
const _validations_1 = require('@validations');
const _config_1 = require('@config');
const distributionItemSchema = _validations_1.distributionItemSchema.omit({
  products: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});
const DistributionItem = _lib_1.sequelize.define(
  'DistributionItem',
  {
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
      type: sequelize_1.DataTypes.ENUM(..._config_1.distributionStatus),
      allowNull: false,
      defaultValue: _config_1.distributionStatus[0],
    },
  },
  {
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
  }
);
exports.DistributionItem = DistributionItem;
//# sourceMappingURL=distributionItem.js.map
