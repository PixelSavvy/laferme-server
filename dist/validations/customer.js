'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.newCustomerSchema = exports.customerSchema = exports.customerProductsSchema = void 0;
const _config_1 = require('@config');
const zod_1 = require('zod');
const product_1 = require('./product');
const REQUIRED_ERROR_MSG = 'სავალდებულოა';
const GEORGIAN_REGEX = new RegExp('^[ა-ჰ\\s.,?!:;"\'()\\-+@#$%^&*<>[\\]{}|\\\\/]+$');
const customerProductsSchema = product_1.productSchema.pick({ id: true });
exports.customerProductsSchema = customerProductsSchema;
const newCustomerSchema = zod_1.z.object({
  name: zod_1.z.string({ required_error: REQUIRED_ERROR_MSG }).regex(GEORGIAN_REGEX, {
    message: 'მხოლოდ ქართული ასოები',
  }),
  priceIndex: zod_1.z.enum(_config_1.priceIndex, {
    required_error: REQUIRED_ERROR_MSG,
  }),
  paymentOption: zod_1.z.enum(_config_1.paymentOptions, {
    required_error: REQUIRED_ERROR_MSG,
  }),
  phone: zod_1.z.string({
    required_error: REQUIRED_ERROR_MSG,
  }),
  email: zod_1.z.string({ required_error: REQUIRED_ERROR_MSG }).email({ message: 'არასწორი ფორმატი' }),
  needInvoice: zod_1.z.enum(['0', '1'], {
    message: REQUIRED_ERROR_MSG,
  }),
  products: zod_1.z.array(customerProductsSchema).optional(),
});
exports.newCustomerSchema = newCustomerSchema;
const customerSchema = newCustomerSchema.extend({
  id: zod_1.z.number().nonnegative(),
  createdAt: zod_1.z.coerce.date(),
  updatedAt: zod_1.z.coerce.date(),
  deletedAt: zod_1.z.coerce.date().nullable(),
});
exports.customerSchema = customerSchema;
//# sourceMappingURL=customer.js.map
