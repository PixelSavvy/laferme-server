import { orderStatus } from '@config';
import { z } from 'zod';

const REQUIRED_ERROR_MSG = 'სავალდებულოა';
const status = Object.keys(orderStatus) as [string, ...string[]];

const orderProductSchema = z.object({
  productId: z
    .number({
      required_error: REQUIRED_ERROR_MSG,
    })
    .nonnegative(),
  quantity: z
    .number({
      required_error: REQUIRED_ERROR_MSG,
    })
    .int()
    .nonnegative(),
  weight: z
    .number({
      required_error: REQUIRED_ERROR_MSG,
    })
    .nonnegative(),
  price: z
    .number({
      required_error: REQUIRED_ERROR_MSG,
    })
    .nonnegative(),
});

const newOrderSchema = z.object({
  customerId: z.number().nonnegative(),
  status: z.enum(status, {
    required_error: REQUIRED_ERROR_MSG,
  }),
  products: z.array(orderProductSchema),
});

const orderSchema = newOrderSchema.extend({
  id: z.number().nonnegative(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().nullable().optional(),
});

export { newOrderSchema, orderProductSchema, orderSchema };
