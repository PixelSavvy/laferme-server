"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newDistributionItemSchema = exports.distributionItemSchema = exports.distributionItemProductsSchema = void 0;
const config_1 = require("@/config");
const zod_1 = require("zod");
const freezoneItem_1 = require("./freezoneItem");
const REQUIRED_ERROR_MSG = 'სავალდებულოა';
const status = Object.values(config_1.distributionStatus);
const distributionItemProductsSchema = freezoneItem_1.freezoneItemProductsSchema
    .extend({
    distributedWeight: zod_1.z.number().nonnegative(),
})
    .omit({
    quantity: true,
    weight: true,
    adjustedQuantity: true,
});
exports.distributionItemProductsSchema = distributionItemProductsSchema;
const newDistributionItemSchema = zod_1.z.object({
    freezoneItemId: zod_1.z
        .number({
        required_error: REQUIRED_ERROR_MSG,
    })
        .nonnegative(),
    status: zod_1.z.enum(status, {
        required_error: REQUIRED_ERROR_MSG,
    }),
    products: zod_1.z.array(distributionItemProductsSchema),
});
exports.newDistributionItemSchema = newDistributionItemSchema;
const distributionItemSchema = newDistributionItemSchema.extend({
    id: zod_1.z.number().nonnegative(),
    createdAt: zod_1.z.coerce.date().optional(),
    updatedAt: zod_1.z.coerce.date().optional(),
    deletedAt: zod_1.z.coerce.date().nullable().optional(),
});
exports.distributionItemSchema = distributionItemSchema;
//# sourceMappingURL=distributionItem.js.map