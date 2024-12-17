import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { z } from 'zod';

import { distributionStatus } from '@/config';
import { sequelize } from '@/lib';
import { distributionItemSchema as schema } from '@/validations';
import { FreezoneItemInstance } from './freezoneItem';

const distributionItemSchema = schema.omit({ products: true, createdAt: true, updatedAt: true, deletedAt: true });
const DISTRIBUTION_ITEM_STATUS = Object.values(distributionStatus);

interface DistributionItemSchema
  extends z.infer<typeof distributionItemSchema>,
    Model<InferAttributes<DistributionItemSchema>, InferCreationAttributes<DistributionItemSchema, { omit: 'id' }>> {
  freezone?: FreezoneItemInstance;
}

const DistributionItem = sequelize.define<DistributionItemSchema>(
  'DistributionItem',
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
        model: 'Orders',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM(...DISTRIBUTION_ITEM_STATUS),
      allowNull: false,
      defaultValue: DISTRIBUTION_ITEM_STATUS[0],
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
        fields: ['freezoneItemId'],
      },
    ],
  }
);

export { DistributionItem, type DistributionItemSchema };
