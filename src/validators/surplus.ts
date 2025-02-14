import { z } from "zod";

const surplusProductSchema = z.object({
  id: z.string(),
  weight: z.coerce.number(),
  quantity: z.coerce.number(),
  identificator: z.string(),
});

const surplusSchema = z.object({
  orderId: z.string(),
  products: z.array(surplusProductSchema),
  createdAt: z.coerce.date(),
  expiresAt: z.coerce.date().optional(),
});

export { surplusProductSchema, surplusSchema };
