import { sequelize } from "@/lib";
import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";

interface DistributionItemProductAttributes {
  distributionItemId: number;
  productId: number;
  price: number;
  adjustedWeight: number;
  distributedWeight: number;
}

interface DistributionItemProductInstance
  extends Model<InferAttributes<DistributionItemProductInstance>, InferCreationAttributes<DistributionItemProductInstance>>,
    DistributionItemProductAttributes {}

const DistributionItemProduct = sequelize.define<DistributionItemProductInstance>(
  "DistributionItemProduct",
  {
    distributionItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "DistributionItems",
        key: "id",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Products",
        key: "id",
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    adjustedWeight: {
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
        fields: ["productId", "distributionItemId"],
      },

      {
        fields: ["distributionItemId"],
      },
      {
        fields: ["productId"],
      },
    ],
  }
);

export { DistributionItemProduct, type DistributionItemProductInstance };
