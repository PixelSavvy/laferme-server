import { customerTypes, paymentMethods, priceIndex } from "@/config";
import { z } from "zod";

const REQUIRED_ERROR_MSG = "სავალდებულოა";
const WRONG_FORMAT_ERROR_MSG = "არასწორი ფორმატი";
const GEORGIAN_REGEX = new RegExp("^[ა-ჰ\\s.,?!:;\"'()\\-+@#$%^&*<>[\\]{}|\\\\/]+$");

const customerProductSchema = z.object({
  productId: z.string(),
  customerId: z.string(),
});

const contactPerson = z.object({
  name: z.string().regex(GEORGIAN_REGEX, {
    message: "მხოლოდ ქართული ასოები",
  }),
  position: z.string(),
  phone: z.string(),
  email: z.string().email({ message: WRONG_FORMAT_ERROR_MSG }),
});

const customerSchema = z.object({
  id: z.string(),

  // Select Fields
  priceIndex: z.enum(priceIndex),
  paymentMethod: z.enum(paymentMethods),
  paysVAT: z.enum(["0", "1"]),
  needsInvoice: z.enum(["0", "1"], {
    message: REQUIRED_ERROR_MSG,
  }),
  type: z.enum(customerTypes),

  // Customer Info
  name: z.string().regex(GEORGIAN_REGEX, {
    message: "მხოლოდ ქართული ასოები",
  }),
  identificationNumber: z.coerce.number(),
  address: z.string(),
  phone: z.string(),
  email: z.string().email({ message: WRONG_FORMAT_ERROR_MSG }),

  // Products
  products: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .optional(),

  // Contact Person
  contactPerson: contactPerson,
});

export { customerProductSchema, customerSchema };
