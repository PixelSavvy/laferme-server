import { z } from "zod";

const REQUIRED_ERROR_MSG = "სავალდებულოა";
const GEORGIAN_REGEX = new RegExp("^[ა-ჰ\\-,\\s]+$");

const pricesSchema = z.object(
  {
    TR1: z
      .number({
        required_error: REQUIRED_ERROR_MSG,
      })
      .nonnegative({
        message: "დადებითი რიცხვი",
      }),
    TR2: z
      .number({
        required_error: REQUIRED_ERROR_MSG,
      })
      .nonnegative({
        message: "დადებითი რიცხვი",
      }),
    TR3: z
      .number({
        required_error: REQUIRED_ERROR_MSG,
      })
      .nonnegative({
        message: "დადებითი რიცხვი",
      }),
    TR4: z
      .number({
        required_error: REQUIRED_ERROR_MSG,
      })
      .nonnegative({
        message: "დადებითი რიცხვი",
      }),
    TR5: z
      .number({
        required_error: REQUIRED_ERROR_MSG,
      })
      .nonnegative({
        message: "დადებითი რიცხვი",
      }),
    TRC: z
      .number({
        required_error: REQUIRED_ERROR_MSG,
      })
      .nonnegative({
        message: "დადებითი რიცხვი",
      }),
    TRD: z
      .number({
        required_error: REQUIRED_ERROR_MSG,
      })
      .nonnegative({
        message: "დადებითი რიცხვი",
      }),
  },
  {
    required_error: REQUIRED_ERROR_MSG,
  }
);

const newProductSchema = z.object({
  title: z
    .string({
      required_error: REQUIRED_ERROR_MSG,
    })
    .regex(GEORGIAN_REGEX, {
      message: "მხოლოდ ქართული, მძიმე ან/და ტირე",
    }),
  productCode: z.string({
    required_error: REQUIRED_ERROR_MSG,
  }),
  hasVAT: z.enum(["0", "1"], {
    required_error: REQUIRED_ERROR_MSG,
  }),
  prices: pricesSchema,
});

const productSchema = newProductSchema.extend({
  id: z
    .number({
      required_error: REQUIRED_ERROR_MSG,
    })
    .nonnegative(),
});

export { newProductSchema, productSchema };
