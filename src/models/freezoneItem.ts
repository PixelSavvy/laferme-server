import { Association, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { z } from "zod";

import { freezoneStatuses, statuses } from "@/config";
import { sequelize } from "@/lib";
import { freezoneItemSchema as schema } from "@/validators";
import { BelongsToManySetAssociationsMixin } from "sequelize";
import { FreezoneItemProductInstance } from "./freezoneItemProduct";

const freezoneItemSchema = schema.omit({
  products: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

interface FreezoneItemInstance
  extends z.infer<typeof freezoneItemSchema>,
    Model<InferAttributes<FreezoneItemInstance>, InferCreationAttributes<FreezoneItemInstance>> {
  products?: Association<FreezoneItemInstance, FreezoneItemProductInstance>;
  updateProducts: BelongsToManySetAssociationsMixin<FreezoneItemProductInstance[], number>;
}

const FreezoneItem = sequelize.define<FreezoneItemInstance>(
  "FreezoneItem",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Orders",
        key: "id",
      },
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Customers",
        key: "id",
      },
    },
    dueDateAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isUpdated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM(...freezoneStatuses),
      allowNull: false,
      defaultValue: statuses.freezone.ACCEPTED,
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
        fields: ["orderId"],
      },
    ],
  }
);

export { FreezoneItem, type FreezoneItemInstance };
