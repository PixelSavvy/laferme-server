import { orderStatuses } from "@/config";
import { z } from "zod";

const REQUIRED_ERROR_MSG = "სავალდებულოა";

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
  status: z.enum(orderStatuses, {
    required_error: REQUIRED_ERROR_MSG,
  }),
  products: z.array(orderProductSchema),
  dueDateAt: z.coerce.date(),
});

const orderSchema = newOrderSchema.extend({
  id: z.number().nonnegative(),
  dueDateAt: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().nullable().optional(),
});

const updateOrderSchema = z.object({
  id: z.number().nonnegative(),
  products: z.array(orderProductSchema),
  dueDateAt: z.coerce.date(),
  status: z.enum(orderStatuses),
});

const updateOrderStatusSchema = z.object({
  id: z.number().nonnegative(),
  status: z.enum(orderStatuses, {
    required_error: REQUIRED_ERROR_MSG,
  }),
});

export { newOrderSchema, orderProductSchema, orderSchema, updateOrderSchema, updateOrderStatusSchema };
