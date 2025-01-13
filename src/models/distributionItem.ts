import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { z } from "zod";

import { distributionStatuses, statuses } from "@/config";
import { sequelize } from "@/lib";
import { distributionItemSchema as schema } from "@/validators";
import { FreezoneItemInstance } from "./freezoneItem";

const distributionItemSchema = schema.omit({
  products: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

interface DistributionItemInstance
  extends z.infer<typeof distributionItemSchema>,
    Model<InferAttributes<DistributionItemInstance>, InferCreationAttributes<DistributionItemInstance, { omit: "id" }>> {
  freezone?: FreezoneItemInstance;
  total: number;
}

const DistributionItem = sequelize.define<DistributionItemInstance>(
  "DistributionItem",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    freezoneItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Orders",
        key: "id",
      },
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    dueDateAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...distributionStatuses),
      allowNull: false,
      defaultValue: statuses.distribution.READYTODELIVER,
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
        fields: ["freezoneItemId"],
      },
    ],
  }
);

export { DistributionItem, type DistributionItemInstance };
