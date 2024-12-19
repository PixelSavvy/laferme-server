'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Customer = void 0;
const sequelize_1 = require('sequelize');
const _lib_1 = require('@lib');
const _config_1 = require('@config');
const _validations_1 = require('@validations');
const customerSchema = _validations_1.customerSchema.omit({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});
const Customer = _lib_1.sequelize.define(
  'Customer',
  {
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
      type: sequelize_1.DataTypes.ENUM(..._config_1.priceIndex),
      allowNull: false,
    },
    paymentOption: {
      type: sequelize_1.DataTypes.ENUM(..._config_1.paymentOptions),
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
  },
  {
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
  }
);
exports.Customer = Customer;
//# sourceMappingURL=customer.js.map
