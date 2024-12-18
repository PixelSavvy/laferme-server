'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.DistributionItemProduct = void 0;
const _lib_1 = require('@lib');
const sequelize_1 = require('sequelize');
const DistributionItemProduct = _lib_1.sequelize.define(
  'DistributionItemProduct',
  {
    distributionItemId: {
      type: sequelize_1.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'DistributionItems',
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
    price: {
      type: sequelize_1.DataTypes.FLOAT,
      allowNull: false,
    },
    adjustedWeight: {
      type: sequelize_1.DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    distributedWeight: {
      type: sequelize_1.DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        fields: ['productId', 'distributionItemId'],
      },
      {
        fields: ['distributionItemId'],
      },
      {
        fields: ['productId'],
      },
    ],
  }
);
exports.DistributionItemProduct = DistributionItemProduct;
//# sourceMappingURL=distributionItemProduct.js.map
