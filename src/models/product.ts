import { sequelize } from "@/lib";
import { productSchema } from "@/validators";
import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { z } from "zod";

import { OrderProductInstance } from "./orderProduct";

interface ProductInstance
  extends z.infer<typeof productSchema>,
    Model<InferAttributes<ProductInstance>, InferCreationAttributes<ProductInstance, { omit: "id" }>> {
  OrderProduct?: OrderProductInstance[];
}

const Product = sequelize.define<ProductInstance>(
  "Product",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hasVAT: {
      type: DataTypes.ENUM("0", "1"),
      allowNull: false,
    },
    prices: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        fields: ["id"],
      },
      {
        fields: ["productCode"],
      },
    ],
  }
);

export { Product, type ProductInstance };
