import { z } from "zod";

import { orderStatuses, stages } from "@/config";
import { customerSchema } from "./customer";

const orderProductSchema = z.object({
  orderId: z.string(),
  productId: z.string(),

  price: z.number().nonnegative(),

  quantity: z.number().nonnegative(),
  preparedQuantity: z.number().nonnegative().optional(),

  weight: z.number().nonnegative(),

  preparedWeight: z.number().nonnegative().optional(),
  distributedWeight: z.number().nonnegative().optional(),
});

const orderSchema = z.object({
  // Order Info
  id: z.string(),
  customerId: z.string(),
  customer: customerSchema.optional(),
  status: z.enum(orderStatuses),
  stage: z.enum(stages),

  // Note
  note: z.string().optional().nullable(),

  // For tracking how many times order has been updated in freezone
  updateCount: z.number().int().nonnegative(),

  // Order Products Info
  products: z.array(
    orderProductSchema
      .omit({
        orderId: true,
        productId: true,
      })
      .extend({
        id: z.string(),
      })
  ),

  // Payment Info
  total: z.coerce.number().nonnegative(),

  // Timestamps
  // Handled by DB
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional(),

  // User Input
  prepareDueAt: z.coerce.date(),
  // When the order was prepared
  preparedAt: z.coerce.date(),
  // When the order was delivered
  deliverDueAt: z.coerce.date(),
  deliveredAt: z.coerce.date(),
});

export { orderProductSchema, orderSchema };
