import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { z } from 'zod';

import { orderStatus } from '@config';
import { sequelize } from '@lib';
import { freezoneItemSchema as schema } from '@validations';

const freezoneItemSchema = schema.omit({ products: true, createdAt: true, updatedAt: true, deletedAt: true });
const FREEZONE_ITEM_STATUS = Object.values(orderStatus);

interface FreezoneItemInstance
  extends z.infer<typeof freezoneItemSchema>,
    Model<InferAttributes<FreezoneItemInstance>, InferCreationAttributes<FreezoneItemInstance, { omit: 'id' }>> {}

const FreezoneItem = sequelize.define<FreezoneItemInstance>(
  'FreezoneItem',
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
        model: 'Orders',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM(...FREEZONE_ITEM_STATUS),
      allowNull: false,
      defaultValue: FREEZONE_ITEM_STATUS[0],
    },
  },
  {
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ['id'],
      },
      {
        fields: ['orderId'],
      },
    ],
  }
);

export { FreezoneItem, type FreezoneItemInstance };
