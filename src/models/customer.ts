import { BelongsToManySetAssociationsMixin, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { z } from "zod";

import { sequelize } from "@/lib";

import { paymentOptions, priceIndex } from "@/config";
import { customerSchema as schema } from "@/validators";
import { ProductInstance } from "./product";

const customerSchema = schema.omit({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

interface CustomerInstance
  extends z.infer<typeof customerSchema>,
    Model<InferAttributes<CustomerInstance>, InferCreationAttributes<CustomerInstance, { omit: "id" }>> {
  setProducts: BelongsToManySetAssociationsMixin<ProductInstance, number>;
}

const Customer = sequelize.define<CustomerInstance>(
  "Customer",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    needInvoice: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    priceIndex: {
      type: DataTypes.ENUM(...priceIndex),
      allowNull: false,
    },
    paymentOption: {
      type: DataTypes.ENUM(...paymentOptions),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
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
        fields: ["email"],
      },
    ],
  }
);

export { Customer, type CustomerInstance };
