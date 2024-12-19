"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchema = exports.newProductSchema = void 0;
const zod_1 = require("zod");
const REQUIRED_ERROR_MSG = "სავალდებულოა";
const GEORGIAN_REGEX = new RegExp("^[ა-ჰ\\-,\\s]+$");
const pricesSchema = zod_1.z.object(
  {
    TR1: zod_1.z
      .number({
        required_error: REQUIRED_ERROR_MSG,
      })
      .nonnegative({
        message: "დადებითი რიცხვი",
      }),
    TR2: zod_1.z
      .number({
        required_error: REQUIRED_ERROR_MSG,
      })
      .nonnegative({
        message: "დადებითი რიცხვი",
      }),
    TR3: zod_1.z
      .number({
        required_error: REQUIRED_ERROR_MSG,
      })
      .nonnegative({
        message: "დადებითი რიცხვი",
      }),
    TR4: zod_1.z
      .number({
        required_error: REQUIRED_ERROR_MSG,
      })
      .nonnegative({
        message: "დადებითი რიცხვი",
      }),
    TR5: zod_1.z
      .number({
        required_error: REQUIRED_ERROR_MSG,
      })
      .nonnegative({
        message: "დადებითი რიცხვი",
      }),
    TRC: zod_1.z
      .number({
        required_error: REQUIRED_ERROR_MSG,
      })
      .nonnegative({
        message: "დადებითი რიცხვი",
      }),
    TRD: zod_1.z
      .number({
        required_error: REQUIRED_ERROR_MSG,
      })
      .nonnegative({
        message: "დადებითი რიცხვი",
      }),
  },
  {
    required_error: REQUIRED_ERROR_MSG,
  },
);
const newProductSchema = zod_1.z.object({
  title: zod_1.z
    .string({
      required_error: REQUIRED_ERROR_MSG,
    })
    .regex(GEORGIAN_REGEX, {
      message: "მხოლოდ ქართული, მძიმე ან/და ტირე",
    }),
  productCode: zod_1.z.string({
    required_error: REQUIRED_ERROR_MSG,
  }),
  hasVAT: zod_1.z.enum(["0", "1"], {
    required_error: REQUIRED_ERROR_MSG,
  }),
  prices: pricesSchema,
});
exports.newProductSchema = newProductSchema;
const productSchema = newProductSchema.extend({
  id: zod_1.z
    .number({
      required_error: REQUIRED_ERROR_MSG,
    })
    .nonnegative(),
});
exports.productSchema = productSchema;
//# sourceMappingURL=product.js.map
