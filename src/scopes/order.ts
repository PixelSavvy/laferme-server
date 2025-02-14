import { stagesObj } from "@/config";
import { Customer, Order, OrderInstance, Product, Surplus } from "@/models";
import { FindOptions, IncludeOptions, InferAttributes } from "sequelize";

// Order Scopes
const baseOrderProductInclude = (attributes: string[]): IncludeOptions => ({
  model: Product,
  as: "products",
  attributes: { exclude: ["prices"] },
  through: {
    as: "orderDetails",
    attributes: { exclude: ["orderId", "productId", ...attributes] },
  },
});

const baseOrderCustomerInclude = (attributes: string[]): IncludeOptions => ({
  model: Customer,
  as: "customer",
  attributes: { include: attributes },
});

const baseSurplusInclude = (attributes: string[]): IncludeOptions => ({
  model: Surplus,
  as: "surplus",
  attributes: { include: attributes },
});

const baseOrderInclude: IncludeOptions[] = [
  baseOrderCustomerInclude([]),
  baseOrderProductInclude([]),
  baseSurplusInclude([]),
];

export const orderScopes = {
  // Default scope
  default: Order.addScope("defaultScope", {
    include: baseOrderInclude,
  }),

  // Dynamic Order scope by stage
  byStage: Order.addScope("byStage", (stage: keyof typeof stagesObj): FindOptions<InferAttributes<OrderInstance>> => {
    return {
      where: {
        stage,
      },
      include: baseOrderInclude,
    };
  }),
};
