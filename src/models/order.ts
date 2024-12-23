import {
  BelongsToManySetAssociationsMixin,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { z } from "zod";

import { orderStatus } from "@/config";
import { sequelize } from "@/lib";
import { orderSchema as schema } from "@/validators";
import { CustomerInstance } from "./customer";
import { OrderProductInstance } from "./orderProduct";

const orderSchema = schema.omit({
  products: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

interface OrderInstance
  extends z.infer<typeof orderSchema>,
    Model<
      InferAttributes<OrderInstance>,
      InferCreationAttributes<OrderInstance, { omit: "id" }>
    > {
  products?: OrderProductInstance[];
  customer?: CustomerInstance;

  setProducts: BelongsToManySetAssociationsMixin<OrderProductInstance, number>;
}

const Order = sequelize.define<OrderInstance>(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Customers",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM(...orderStatus),
      allowNull: false,
      defaultValue: orderStatus[0],
    },
  },
  {
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ["id"],
      },
      {
        fields: ["customerId"],
      },
    ],
  }
);

export { Order, type OrderInstance };
