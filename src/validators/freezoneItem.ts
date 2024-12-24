import { orderStatus } from "@/config";
import { z } from "zod";
import { orderProductSchema } from "./order";

const REQUIRED_ERROR_MSG = "სავალდებულოა";

const freezoneItemProductsSchema = orderProductSchema.extend({
  freezoneItemId: z.number().nonnegative(),
  adjustedWeight: z.number().nonnegative(),
  adjustedQuantity: z.number().int().nonnegative(),
});

const newFreezoneItemSchema = z.object({
  orderId: z
    .number({
      required_error: REQUIRED_ERROR_MSG,
    })
    .nonnegative(),
  customerId: z.number().nonnegative(),
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

const updateFreezoneItemSchema = z.object({
  id: z.number().nonnegative(),
  products: z.array(freezoneItemProductsSchema),
});

const updateFreezoneItemStatusSchema = z.object({
  id: z.number().nonnegative(),
  status: z.enum(orderStatus, {
    required_error: REQUIRED_ERROR_MSG,
  }),
});

export {
  freezoneItemProductsSchema,
  freezoneItemSchema,
  newFreezoneItemSchema,
  updateFreezoneItemSchema,
  updateFreezoneItemStatusSchema,
};
