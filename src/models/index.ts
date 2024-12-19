import { Product } from "./product";

import { Customer } from "./customer";

import { Order } from "./order";
import { OrderProduct } from "./orderProduct";

import { FreezoneItem } from "./freezoneItem";
import { FreezoneItemProduct } from "./freezoneItemProduct";

import { DistributionItem } from "./distributionItem";
import { DistributionItemProduct } from "./distributionItemProduct";

// Product <-> Customer (Many to Many)
Customer.belongsToMany(Product, {
  through: "CustomerProducts",
  foreignKey: "customerId",
  as: "products",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Product.belongsToMany(Customer, {
  through: "CustomerProducts",
  foreignKey: "productId",
  as: "customers",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Customer <-> Order (One to Many)
Customer.hasMany(Order, {
  foreignKey: "customerId",
  as: "orders",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Order.belongsTo(Customer, {
  foreignKey: "customerId",
  as: "customer",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Order <-> Product (Many to Many)
Order.belongsToMany(Product, {
  through: OrderProduct,
  foreignKey: "orderId",
  as: "products",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Product.belongsToMany(Order, {
  through: OrderProduct,
  foreignKey: "productId",
  as: "orders",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// FreezoneItem <-> Order (One to One)
FreezoneItem.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Order.hasOne(FreezoneItem, {
  foreignKey: "orderId",
  as: "freezoneItem",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

FreezoneItem.belongsToMany(Product, {
  through: FreezoneItemProduct,
  as: "products",
  foreignKey: "freezoneItemId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Product.belongsToMany(FreezoneItem, {
  through: FreezoneItemProduct,
  as: "freezoneItemProducts",
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// DistributionItem <=> FreezoneItem (One to One)
DistributionItem.belongsTo(FreezoneItem, {
  foreignKey: "freezoneItemId",
  as: "freezone",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

FreezoneItem.hasOne(DistributionItem, {
  foreignKey: "freezoneItemId",
  as: "distribution",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

DistributionItem.belongsToMany(Product, {
  through: DistributionItemProduct,
  as: "products",
  foreignKey: "distributionItemId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Product.belongsToMany(DistributionItem, {
  through: DistributionItemProduct,
  as: "distributionItemProducts",
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export * from "./customer";
export * from "./distributionItem";
export * from "./distributionItemProduct";
export * from "./freezoneItem";
export * from "./freezoneItemProduct";
export * from "./order";
export * from "./orderProduct";
export * from "./product";
