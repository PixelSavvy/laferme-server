import { distributionStatuses } from "@/config";
import { z } from "zod";
import { freezoneItemProductsSchema } from "./freezoneItem";

const REQUIRED_ERROR_MSG = "სავალდებულოა";

const distributionItemProductsSchema = freezoneItemProductsSchema
  .extend({
    distributionItemId: z.number().nonnegative(),
    distributedWeight: z.number().nonnegative(),
  })
  .omit({
    quantity: true,
    weight: true,
    adjustedQuantity: true,
    freezoneItemId: true,
  });

const newDistributionItemSchema = z.object({
  freezoneItemId: z
    .number({
      required_error: REQUIRED_ERROR_MSG,
    })
    .nonnegative(),
  status: z.enum(distributionStatuses, {
    required_error: REQUIRED_ERROR_MSG,
  }),
  total: z.number().nonnegative(),
  dueDateAt: z.coerce.date(),
  products: z.array(distributionItemProductsSchema),
});

const distributionItemSchema = newDistributionItemSchema.extend({
  id: z.number().nonnegative(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  dueDateAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable().optional(),
});

export { distributionItemProductsSchema, distributionItemSchema, newDistributionItemSchema };