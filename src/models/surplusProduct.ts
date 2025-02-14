import { sequelize } from "@/lib";

import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";

interface SurplusProductAttributes {
  productId: string;
  surplusId: string;
  quantity: number;
  weight: number;
  identificator: string;
}

interface SurplusProductInstance
  extends SurplusProductAttributes,
    Model<InferAttributes<SurplusProductInstance>, InferCreationAttributes<SurplusProductInstance>> {}

const SurplusProduct = sequelize.define<SurplusProductInstance>(
  "SurplusProduct",
  {
    surplusId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Surpluses",
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

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    identificator: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        fields: ["productId"],
      },
      {
        fields: ["surplusId", "productId"],
      },
    ],
  }
);

export { SurplusProduct, type SurplusProductInstance };
