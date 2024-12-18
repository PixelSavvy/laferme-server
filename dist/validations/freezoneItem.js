"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFreezoneItemSchema = exports.newFreezoneItemSchema = exports.freezoneItemSchema = exports.freezoneItemProductsSchema = void 0;
const _config_1 = require("@config");
const zod_1 = require("zod");
const order_1 = require("./order");
const REQUIRED_ERROR_MSG = 'სავალდებულოა';
const freezoneItemProductsSchema = order_1.orderProductSchema.extend({
    freezoneItemId: zod_1.z.number().nonnegative(),
    adjustedWeight: zod_1.z.number().nonnegative(),
    adjustedQuantity: zod_1.z.number().int().nonnegative(),
});
exports.freezoneItemProductsSchema = freezoneItemProductsSchema;
const newFreezoneItemSchema = zod_1.z.object({
    orderId: zod_1.z
        .number({
        required_error: REQUIRED_ERROR_MSG,
    })
        .nonnegative(),
    customerId: zod_1.z.number().nonnegative(),
    status: zod_1.z.enum(_config_1.orderStatus, {
        required_error: REQUIRED_ERROR_MSG,
    }),
    products: zod_1.z.array(freezoneItemProductsSchema),
});
exports.newFreezoneItemSchema = newFreezoneItemSchema;
const freezoneItemSchema = newFreezoneItemSchema.extend({
    id: zod_1.z.number().nonnegative(),
    createdAt: zod_1.z.coerce.date().optional(),
    updatedAt: zod_1.z.coerce.date().optional(),
    deletedAt: zod_1.z.coerce.date().nullable().optional(),
});
exports.freezoneItemSchema = freezoneItemSchema;
const updateFreezoneItemSchema = zod_1.z.object({
    id: zod_1.z.number().nonnegative(),
    products: zod_1.z.array(freezoneItemProductsSchema),
});
exports.updateFreezoneItemSchema = updateFreezoneItemSchema;
//# sourceMappingURL=freezoneItem.js.map