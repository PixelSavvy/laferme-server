import {
  BelongsToManyAddAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { z } from "zod";

import { sequelize } from "@/lib";

import { customerTypes, customerTypesObj, paymentMethods, paymentMethodsObj, priceIndex } from "@/config";
import { customerSchema } from "@/validators";
import { ProductInstance } from "./product";

interface CustomerInstance
  extends z.infer<typeof customerSchema>,
    Model<InferAttributes<CustomerInstance>, InferCreationAttributes<CustomerInstance>> {
  addProducts: BelongsToManyAddAssociationsMixin<ProductInstance, ProductInstance["id"]>;
  setProducts: BelongsToManySetAssociationsMixin<ProductInstance, ProductInstance["id"]>;
}

const Customer = sequelize.define<CustomerInstance>(
  "Customer",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    needsInvoice: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "0",
    },
    priceIndex: {
      type: DataTypes.ENUM(...priceIndex),
      allowNull: false,
      defaultValue: priceIndex[0],
    },
    paymentMethod: {
      type: DataTypes.ENUM(...paymentMethods),
      allowNull: false,
      defaultValue: paymentMethodsObj.CASH,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM(...customerTypes),
      defaultValue: customerTypesObj.INDIVIDUAL,
    },
    contactPerson: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    paysVAT: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "0",
    },
    identificationNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
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
      {
        fields: ["email"],
      },
      {
        unique: true,
        fields: ["identificationNumber"],
      },
      {
        unique: true,
        fields: ["id", "identificationNumber"],
      },
      {
        fields: ["email", "identificationNumber"],
      },
    ],
  }
);

export { Customer, type CustomerInstance };
