import { sequelize } from "@/lib";
import { freezoneItemProductsSchema } from "@/validators";
import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { z } from "zod";

interface FreezoneItemProductInstance
  extends z.infer<typeof freezoneItemProductsSchema>,
    Model<InferAttributes<FreezoneItemProductInstance>, InferCreationAttributes<FreezoneItemProductInstance>> {}

const FreezoneItemProduct = sequelize.define<FreezoneItemProductInstance>(
  "FreezoneItemProduct",
  {
    freezoneItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "FreezoneItems",
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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    adjustedQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    adjustedWeight: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        fields: ["productId", "freezoneItemId"],
      },

      {
        fields: ["freezoneItemId"],
      },
      {
        fields: ["productId"],
      },
    ],
  }
);

export { FreezoneItemProduct, type FreezoneItemProductInstance };
