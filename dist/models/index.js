'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __exportStar =
  (this && this.__exportStar) ||
  function (m, exports) {
    for (var p in m)
      if (p !== 'default' && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
  };
Object.defineProperty(exports, '__esModule', { value: true });
const product_1 = require('./product');
const customer_1 = require('./customer');
const order_1 = require('./order');
const orderProduct_1 = require('./orderProduct');
const freezoneItem_1 = require('./freezoneItem');
const freezoneItemProduct_1 = require('./freezoneItemProduct');
const distributionItem_1 = require('./distributionItem');
const distributionItemProduct_1 = require('./distributionItemProduct');
// Product <-> Customer (Many to Many)
customer_1.Customer.belongsToMany(product_1.Product, {
  through: 'CustomerProducts',
  foreignKey: 'customerId',
  as: 'products',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
product_1.Product.belongsToMany(customer_1.Customer, {
  through: 'CustomerProducts',
  foreignKey: 'productId',
  as: 'customers',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
// Customer <-> Order (One to Many)
customer_1.Customer.hasMany(order_1.Order, {
  foreignKey: 'customerId',
  as: 'orders',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
order_1.Order.belongsTo(customer_1.Customer, {
  foreignKey: 'customerId',
  as: 'customer',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
// Order <-> Product (Many to Many)
order_1.Order.belongsToMany(product_1.Product, {
  through: orderProduct_1.OrderProduct,
  foreignKey: 'orderId',
  as: 'products',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
product_1.Product.belongsToMany(order_1.Order, {
  through: orderProduct_1.OrderProduct,
  foreignKey: 'productId',
  as: 'orders',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
// FreezoneItem <-> Order (One to One)
freezoneItem_1.FreezoneItem.belongsTo(order_1.Order, {
  foreignKey: 'orderId',
  as: 'order',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
order_1.Order.hasOne(freezoneItem_1.FreezoneItem, {
  foreignKey: 'orderId',
  as: 'freezoneItem',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
freezoneItem_1.FreezoneItem.belongsToMany(product_1.Product, {
  through: freezoneItemProduct_1.FreezoneItemProduct,
  as: 'products',
  foreignKey: 'freezoneItemId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
product_1.Product.belongsToMany(freezoneItem_1.FreezoneItem, {
  through: freezoneItemProduct_1.FreezoneItemProduct,
  as: 'freezoneItemProducts',
  foreignKey: 'productId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
// DistributionItem <=> FreezoneItem (One to One)
distributionItem_1.DistributionItem.belongsTo(freezoneItem_1.FreezoneItem, {
  foreignKey: 'freezoneItemId',
  as: 'freezone',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
freezoneItem_1.FreezoneItem.hasOne(distributionItem_1.DistributionItem, {
  foreignKey: 'freezoneItemId',
  as: 'distribution',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
distributionItem_1.DistributionItem.belongsToMany(product_1.Product, {
  through: distributionItemProduct_1.DistributionItemProduct,
  as: 'products',
  foreignKey: 'distributionItemId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
product_1.Product.belongsToMany(distributionItem_1.DistributionItem, {
  through: distributionItemProduct_1.DistributionItemProduct,
  as: 'distributionItemProducts',
  foreignKey: 'productId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
__exportStar(require('./customer'), exports);
__exportStar(require('./distributionItem'), exports);
__exportStar(require('./distributionItemProduct'), exports);
__exportStar(require('./freezoneItem'), exports);
__exportStar(require('./freezoneItemProduct'), exports);
__exportStar(require('./order'), exports);
__exportStar(require('./orderProduct'), exports);
__exportStar(require('./product'), exports);
//# sourceMappingURL=index.js.map
