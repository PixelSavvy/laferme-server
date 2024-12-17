import { distributionStatus } from '@/config';
import { z } from 'zod';
import { freezoneItemProductsSchema } from './freezoneItem';

const REQUIRED_ERROR_MSG = 'სავალდებულოა';
const status = Object.values(distributionStatus) as [string, ...string[]];

const distributionItemProductsSchema = freezoneItemProductsSchema
  .extend({
    distributedWeight: z.number().nonnegative(),
  })
  .omit({
    quantity: true,
    weight: true,
    adjustedQuantity: true,
  });

const newDistributionItemSchema = z.object({
  freezoneItemId: z
    .number({
      required_error: REQUIRED_ERROR_MSG,
    })
    .nonnegative(),
  status: z.enum(status, {
    required_error: REQUIRED_ERROR_MSG,
  }),
  products: z.array(distributionItemProductsSchema),
});

const distributionItemSchema = newDistributionItemSchema.extend({
  id: z.number().nonnegative(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().nullable().optional(),
});

export { distributionItemProductsSchema, distributionItemSchema, newDistributionItemSchema };
