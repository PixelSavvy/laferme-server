import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { z } from "zod";

import { sequelize } from "@/lib";
import { customerProductSchema } from "@/validators";

interface CustomerProductInstance
  extends z.infer<typeof customerProductSchema>,
    Model<InferAttributes<CustomerProductInstance>, InferCreationAttributes<CustomerProductInstance>> {}

const CustomerProduct = sequelize.define<CustomerProductInstance>(
  "CustomerProduct",
  {
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Products",
        key: "id",
      },
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Customers",
        key: "id",
      },
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["customerId", "productId"],
      },
    ],
  }
);

export { CustomerProduct, type CustomerProductInstance };
