"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerController = void 0;
const _helpers_1 = require("@helpers");
const _services_1 = require("@services");
const _validations_1 = require("@validations");
const getCustomers = async (req, res) => {
  try {
    const foundProducts = await _services_1.customerServices.getCustomers(
      req,
      res,
    );
    if (!foundProducts.length)
      return (0, _helpers_1.sendResponse)(
        res,
        200,
        "სარეალიზაციო პუნქტები ვერ მოიძებნა",
        [],
      );
    return (0, _helpers_1.sendResponse)(
      res,
      200,
      "სარეალიზაციო პუნქტი წარმატებით მოიძებნა",
      foundProducts,
    );
  } catch (error) {
    console.error(error);
    return (0, _helpers_1.sendResponse)(
      res,
      505,
      "შეცდომა სარეალიზაციო პუნქტების ძებნისას",
      error,
    );
  }
};
const getCustomer = async (req, res) => {
  try {
    const foundProducts = await _services_1.customerServices.getCustomer(
      req,
      res,
    );
    if (!foundProducts.length)
      return (0, _helpers_1.sendResponse)(
        res,
        200,
        "სარეალიზაციო პუნქტი ვერ მოიძებნა",
        [],
      );
    return (0, _helpers_1.sendResponse)(
      res,
      200,
      "სარეალიზაციო პუნქტი წარმატებით მოიძებნა",
      foundProducts,
    );
  } catch (error) {
    console.error(error);
    return (0, _helpers_1.sendResponse)(
      res,
      505,
      "შეცდომა სარეალიზაციო პუნქტის ძებნისას",
      error,
    );
  }
};
const addCustomer = async (req, res) => {
  const data = req.body;
  const parsedData = _validations_1.newCustomerSchema.safeParse(data);
  if (!parsedData.success)
    return (0, _helpers_1.sendResponse)(
      res,
      400,
      "Validation error",
      parsedData.error.format(),
    );
  try {
    const newCustomer = await _services_1.customerServices.addCustomer(
      req,
      res,
      parsedData.data,
    );
    // wrong input
    if (newCustomer.exists)
      return (0, _helpers_1.sendResponse)(
        res,
        400,
        "სარეალიზაციო პუნქტი მსგავსი ელ.ფოსტით უკვე არსებობს",
        newCustomer.customer,
      );
    return (0, _helpers_1.sendResponse)(
      res,
      201,
      "სარეალიზაციო პუნქტი წარმატებით დაემატა",
      newCustomer,
    );
  } catch (error) {
    console.error("Error adding a customer:", error);
    return (0, _helpers_1.sendResponse)(
      res,
      500,
      "შეცდომა სარეალიზაციო პუნქტის შექმნისას",
      error,
    );
  }
};
const updateCustomer = async (req, res) => {
  const data = req.body;
  const parsedData = _validations_1.customerSchema.safeParse(data);
  if (!parsedData.success)
    return (0, _helpers_1.sendResponse)(
      res,
      400,
      "Validation error",
      parsedData.error.format(),
    );
  try {
    const updatedCustomer = await _services_1.customerServices.updateCustomer(
      parsedData.data,
    );
    if (!updatedCustomer.exists)
      return (0, _helpers_1.sendResponse)(
        res,
        404,
        "სარეალიზაციო პუნქტი მსგავსი საიდენტიფიკაციო კოდით ვერ მოიძებნა",
        updatedCustomer.customer,
      );
    return (0, _helpers_1.sendResponse)(
      res,
      200,
      "სარეალიზაციო პუნქტი წარმატებით განახლდა",
      updatedCustomer,
    );
  } catch (error) {
    console.error(error);
    return (0, _helpers_1.sendResponse)(
      res,
      505,
      "შეცდომა სარეალიზაციო პუნქტის რედაქტირებისას",
      error,
    );
  }
};
const deleteCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    await _services_1.customerServices.deleteCustomer(req, res, id);
  } catch (error) {
    console.error(error);
    return (0, _helpers_1.sendResponse)(
      res,
      505,
      "შეცდომა სარეალიზაციო პუნქტის წაშლისას",
      error,
    );
  }
};
exports.customerController = {
  addCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomer,
};
//# sourceMappingURL=customer.js.map
