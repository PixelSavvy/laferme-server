import { orderStatus } from '@config';
import { z } from 'zod';
import { orderProductSchema } from './order';

const REQUIRED_ERROR_MSG = 'სავალდებულოა';

const freezoneItemProductsSchema = orderProductSchema.extend({
  adjustedWeight: z.number().nonnegative(),
  adjustedQuantity: z.number().int().nonnegative(),
});

const newFreezoneItemSchema = z.object({
  orderId: z
    .number({
      required_error: REQUIRED_ERROR_MSG,
    })
    .nonnegative(),
  status: z.enum(orderStatus, {
    required_error: REQUIRED_ERROR_MSG,
  }),
  products: z.array(freezoneItemProductsSchema),
});

const freezoneItemSchema = newFreezoneItemSchema.extend({
  id: z.number().nonnegative(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().nullable().optional(),
});

export { freezoneItemProductsSchema, freezoneItemSchema, newFreezoneItemSchema };
