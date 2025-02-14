import { Customer } from "./customer";
import { CustomerProduct } from "./customerProduct";
import { Order } from "./order";
import { OrderProduct } from "./orderProduct";
import { Product } from "./product";
import { Surplus } from "./surplus";
import { SurplusProduct } from "./surplusProduct"; // Junction table

// Product <-> Customer (Many to Many)
Customer.belongsToMany(Product, {
  through: CustomerProduct, // Join table between Customer and Product
  foreignKey: "customerId",
  as: "products",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Product.belongsToMany(Customer, {
  through: CustomerProduct, // Join table between Product and Customer
  foreignKey: "productId",
  as: "customers",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Product <-> SurplusProducts (Many to Many through junction)
Product.belongsToMany(Surplus, {
  through: SurplusProduct, // Join table between Product and Surplus
  foreignKey: "productId",
  as: "surpluses",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Surplus.belongsToMany(Product, {
  through: SurplusProduct, // Join table between Surplus and Product
  foreignKey: "surplusId",
  as: "products",
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
  through: OrderProduct, // Join table between Order and Product
  foreignKey: "orderId",
  as: "products",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Product.belongsToMany(Order, {
  through: OrderProduct, // Join table between Product and Order
  foreignKey: "productId",
  as: "orders",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Order <-> Surplus (One to One)
Order.hasOne(Surplus, {
  foreignKey: "orderId",
  as: "surplus",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Surplus.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export * from "./customer";
export * from "./customerProduct";
export * from "./order";
export * from "./orderProduct";
export * from "./product";
export * from "./surplus";
export * from "./surplusProduct";

export * from "./employee";

export * from "@/hooks";
export * from "@/scopes";
