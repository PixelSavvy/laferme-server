'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Order = void 0;
const sequelize_1 = require('sequelize');
const _config_1 = require('@config');
const _lib_1 = require('@lib');
const _validations_1 = require('@validations');
const orderSchema = _validations_1.orderSchema.omit({ products: true, createdAt: true, updatedAt: true, deletedAt: true });
const Order = _lib_1.sequelize.define(
  'Order',
  {
    id: {
      type: sequelize_1.DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    customerId: {
      type: sequelize_1.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Customers',
        key: 'id',
      },
    },
    status: {
      type: sequelize_1.DataTypes.ENUM(..._config_1.orderStatus),
      allowNull: false,
      defaultValue: _config_1.orderStatus[0],
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
        fields: ['customerId'],
      },
    ],
  }
);
exports.Order = Order;
//# sourceMappingURL=order.js.map
