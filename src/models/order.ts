import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { z } from "zod";

import { orderStatuses, stages, stagesObj, statusesObj } from "@/config";
import { sequelize } from "@/lib";
import { orderSchema } from "@/validators";

const orderWithoutProductsSchema = orderSchema.omit({
  products: true,
});

type OrderWithoutProducts = z.infer<typeof orderWithoutProductsSchema>;

interface OrderInstance
  extends OrderWithoutProducts,
    Model<InferAttributes<OrderInstance>, InferCreationAttributes<OrderInstance>> {
  products?: any;
}

const Order = sequelize.define<OrderInstance>(
  "Order",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: "",
      allowNull: false,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Customers",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM(...orderStatuses),
      allowNull: false,
      defaultValue: statusesObj.order.ACCEPTED,
    },
    stage: {
      type: DataTypes.ENUM(...stages),
      defaultValue: stagesObj.ORDER,
      allowNull: false,
    },

    note: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },

    updateCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },

    prepareDueAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    preparedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    deliverDueAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: true,
    paranoid: true,

    indexes: [
      {
        unique: true,
        fields: ["id"],
      },
    ],
  }
);

export { Order, type OrderInstance };
