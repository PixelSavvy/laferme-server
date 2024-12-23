import { paymentOptions, priceIndex } from "@/config";
import { z } from "zod";
import { productSchema } from "./product";

const REQUIRED_ERROR_MSG = "სავალდებულოა";
const GEORGIAN_REGEX = new RegExp(
  "^[ა-ჰ\\s.,?!:;\"'()\\-+@#$%^&*<>[\\]{}|\\\\/]+$"
);

const customerProductsSchema = productSchema.pick({ id: true });

const newCustomerSchema = z.object({
  name: z.string({ required_error: REQUIRED_ERROR_MSG }).regex(GEORGIAN_REGEX, {
    message: "მხოლოდ ქართული ასოები",
  }),
  priceIndex: z.enum(priceIndex, {
    required_error: REQUIRED_ERROR_MSG,
  }),
  paymentOption: z.enum(paymentOptions, {
    required_error: REQUIRED_ERROR_MSG,
  }),
  phone: z.string({
    required_error: REQUIRED_ERROR_MSG,
  }),
  email: z
    .string({ required_error: REQUIRED_ERROR_MSG })
    .email({ message: "არასწორი ფორმატი" }),
  needInvoice: z.enum(["0", "1"], {
    message: REQUIRED_ERROR_MSG,
  }),
  products: z.array(customerProductsSchema).optional(),
});

const customerSchema = newCustomerSchema.extend({
  id: z.number().nonnegative(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export { customerProductsSchema, customerSchema, newCustomerSchema };
