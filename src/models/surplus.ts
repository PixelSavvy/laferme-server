import { addDays, differenceInHours } from "date-fns";
import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";

import { sequelize } from "@/lib";

interface SurplusAttributes {
  id: string;
  orderId: string;
  createdAt: Date;
  expiresAt: Date | null;
  condition?: string;
}

interface SurplusInstance
  extends SurplusAttributes,
    Model<InferAttributes<SurplusInstance>, InferCreationAttributes<SurplusInstance, { omit: "id" }>> {}

const Surplus = sequelize.define<SurplusInstance>(
  "Surplus",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Orders",
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    condition: {
      type: DataTypes.VIRTUAL,
      allowNull: true,
      get(this: SurplusInstance) {
        const remainingHours = Math.abs(
          differenceInHours(new Date(this.expiresAt || addDays(new Date(this.createdAt), 3)), new Date())
        );

        if (remainingHours <= 72 && remainingHours >= 48) {
          return "FRESH";
        } else if (remainingHours < 48 && remainingHours >= 24) {
          return "MEDIUM";
        } else if (remainingHours < 24 && remainingHours >= 0) {
          return "OLD";
        } else {
          return "EXPIRED";
        }
      },
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ["orderId"],
      },
      {
        fields: ["expiresAt"],
      },
    ],
  }
);

Surplus.addHook("beforeSave", (surplus) => {
  const remainingHours = Math.abs(
    differenceInHours(
      new Date(surplus.dataValues.expiresAt || addDays(new Date(surplus.dataValues.createdAt), 3)),
      new Date()
    )
  );

  if (remainingHours <= 72 && remainingHours >= 48) {
    surplus.dataValues.condition = "FRESH";
  } else if (remainingHours < 48 && remainingHours >= 24) {
    surplus.dataValues.condition = "MEDIUM";
  } else if (remainingHours < 24 && remainingHours >= 0) {
    surplus.dataValues.condition = "OLD";
  } else {
    surplus.dataValues.condition = "EXPIRED";
  }
});

export { Surplus, type SurplusInstance };
