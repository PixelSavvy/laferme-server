"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.freezoneController = void 0;
const _helpers_1 = require("@helpers");
const _services_1 = require("@services");
const _validations_1 = require("@validations");
const getFreezoneItem = async (req, res) => {
  const { id } = req.params;
  try {
    const freezoneItem = await _services_1.freezoneServices.getFreezoneItem(
      req,
      res,
      Number(id),
    );
    return (0, _helpers_1.sendResponse)(
      res,
      200,
      "შეკვეთა თავისუფალ ზონაში წარმატებით მოიძებნა!",
      freezoneItem,
    );
  } catch (error) {
    console.error("Error fetching an order", error);
    return (0, _helpers_1.sendResponse)(
      res,
      500,
      "შეცდომა შეკვეთის ძებნისას",
      error,
    );
  }
};
const getFreezoneItems = async (req, res) => {
  const { id } = req.params;
  try {
    const freezoneItems = await _services_1.freezoneServices.getFreezoneItems(
      req,
      res,
      Number(id),
    );
    if (!freezoneItems.exists)
      return (0, _helpers_1.sendResponse)(
        res,
        202,
        "შეკვეთები თავისუფალ ზონაში ვერ მოიძებნა",
        freezoneItems.freezoneItems,
      );
    return (0, _helpers_1.sendResponse)(
      res,
      200,
      "შეკვეთები თავისუფალ ზონაში წარმატებით მოიძებნა!",
      freezoneItems.freezoneItems,
    );
  } catch (error) {
    console.error("Error fetching an order", error);
    return (0, _helpers_1.sendResponse)(
      res,
      500,
      "შეცდომა შეკვეთების ძებნისას",
      error,
    );
  }
};
const updateFreezoneItem = async (req, res) => {
  const data = req.body;
  const parsedData = _validations_1.updateFreezoneItemSchema.safeParse(data);
  if (!parsedData.success)
    return (0, _helpers_1.sendResponse)(
      res,
      400,
      "Validation error",
      parsedData.error.format(),
    );
  try {
    const updatedFreezoneItem =
      await _services_1.freezoneServices.updateFreezoneItem(
        req,
        res,
        parsedData.data,
      );
    if (!updatedFreezoneItem.exists)
      return (0, _helpers_1.sendResponse)(
        res,
        202,
        "შეკვეთა ვერ მოიძებნა",
        updatedFreezoneItem.freezoneItem,
      );
    return (0, _helpers_1.sendResponse)(
      res,
      200,
      "შეკვეთა წარმატებით განახლდა",
      updatedFreezoneItem.freezoneItem,
    );
  } catch (error) {
    console.error("Error updating an order:", error);
    return (0, _helpers_1.sendResponse)(
      res,
      500,
      "შეცდომა შეკვეთის განახლებისას",
      error,
    );
  }
};
exports.freezoneController = {
  getFreezoneItem,
  getFreezoneItems,
  updateFreezoneItem,
};
//# sourceMappingURL=freezone.js.map
