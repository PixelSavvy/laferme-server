"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderSchema =
  exports.orderSchema =
  exports.orderProductSchema =
  exports.newOrderSchema =
    void 0;
const _config_1 = require("@config");
const zod_1 = require("zod");
const REQUIRED_ERROR_MSG = "სავალდებულოა";
const orderProductSchema = zod_1.z.object({
  productId: zod_1.z
    .number({
      required_error: REQUIRED_ERROR_MSG,
    })
    .nonnegative(),
  quantity: zod_1.z
    .number({
      required_error: REQUIRED_ERROR_MSG,
    })
    .int()
    .nonnegative(),
  weight: zod_1.z
    .number({
      required_error: REQUIRED_ERROR_MSG,
    })
    .nonnegative(),
  price: zod_1.z
    .number({
      required_error: REQUIRED_ERROR_MSG,
    })
    .nonnegative(),
});
exports.orderProductSchema = orderProductSchema;
const newOrderSchema = zod_1.z.object({
  customerId: zod_1.z.number().nonnegative(),
  status: zod_1.z.enum(_config_1.orderStatus, {
    required_error: REQUIRED_ERROR_MSG,
  }),
  products: zod_1.z.array(orderProductSchema),
});
exports.newOrderSchema = newOrderSchema;
const orderSchema = newOrderSchema.extend({
  id: zod_1.z.number().nonnegative(),
  createdAt: zod_1.z.coerce.date().optional(),
  updatedAt: zod_1.z.coerce.date().optional(),
  deletedAt: zod_1.z.coerce.date().nullable().optional(),
});
exports.orderSchema = orderSchema;
const updateOrderSchema = zod_1.z.object({
  id: zod_1.z.number().nonnegative(),
  products: zod_1.z.array(orderProductSchema),
});
exports.updateOrderSchema = updateOrderSchema;
//# sourceMappingURL=order.js.map
