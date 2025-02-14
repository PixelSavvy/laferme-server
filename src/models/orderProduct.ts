import { sequelize } from "@/lib";
import { orderProductSchema } from "@/validators";
import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";

import { z } from "zod";

interface OrderProductInstance
  extends z.infer<typeof orderProductSchema>,
    Model<InferAttributes<OrderProductInstance>, InferCreationAttributes<OrderProductInstance>> {}

const OrderProduct = sequelize.define<OrderProductInstance>(
  "OrderProduct",
  {
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Orders",
        key: "id",
      },
    },

    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Products",
        key: "id",
      },
      unique: true,
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    preparedQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },

    preparedWeight: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },

    distributedWeight: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        fields: ["productId"],
      },
      {
        fields: ["orderId", "productId"],
      },
    ],
  }
);

export { OrderProduct, type OrderProductInstance };
