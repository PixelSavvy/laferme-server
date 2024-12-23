import { sequelize } from "@/lib";
import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

interface OrderProductInstance
  extends Model<
    InferAttributes<OrderProductInstance>,
    InferCreationAttributes<OrderProductInstance>
  > {
  orderId: number;
  productId: number;
  quantity: number;
  weight: number;
  price: number;
}

const OrderProduct = sequelize.define<OrderProductInstance>(
  "OrderProduct",
  {
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Orders",
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
  },
  {
    timestamps: false,
    indexes: [
      {
        fields: ["orderId", "productId"],
      },

      {
        fields: ["orderId"],
      },
      {
        fields: ["productId"],
      },
    ],
  }
);

export { OrderProduct, type OrderProductInstance };
