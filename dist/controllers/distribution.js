"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distributionController = void 0;
const helpers_1 = require("@/helpers");
const services_1 = require("@/services");
const validations_1 = require("@/validations");
const getDistributionItem = async (req, res) => {
    const { id } = req.params;
    try {
        const distributionItem = await services_1.distributionServices.getDistributionItem(req, res, Number(id));
        return (0, helpers_1.sendResponse)(res, 200, 'დისტრიბუცია წარმატებით მოიძებნა!', distributionItem);
    }
    catch (error) {
        console.error('Error fetching an order', error);
        return (0, helpers_1.sendResponse)(res, 500, 'შეცდომა დისტრიბუციის ძებნისას', error);
    }
};
const getDistributionItems = async (req, res) => {
    try {
        const distributionItem = await services_1.distributionServices.getDistributionItems(req, res);
        if (!distributionItem.exists)
            return (0, helpers_1.sendResponse)(res, 404, 'მსგავსი დისტრიბუცია ვერ მოიძებნა', distributionItem.data);
        return (0, helpers_1.sendResponse)(res, 200, 'დისტრიბუციები წარმატებით მოიძებნა!', distributionItem.data);
    }
    catch (error) {
        console.error('Error fetching an order', error);
        return (0, helpers_1.sendResponse)(res, 500, 'შეცდომა დისტრიბუციის ძებნისას', error);
    }
};
const updateDistributionItem = async (req, res) => {
    const data = req.body;
    const parsedData = validations_1.distributionItemSchema.safeParse(data);
    if (!parsedData.success)
        return (0, helpers_1.sendResponse)(res, 400, 'Validation error', parsedData.error.format());
    try {
        const updatedOrder = await services_1.distributionServices.updateDistributionItem(req, res, parsedData.data);
        if (!updatedOrder.exists)
            return (0, helpers_1.sendResponse)(res, 404, 'შეკვეთა ვერ მოიძებნა', updatedOrder.data);
        return (0, helpers_1.sendResponse)(res, 200, 'შეკვეთა წარმატებით განახლდა', updatedOrder.data);
    }
    catch (error) {
        console.error('Error updating an order:', error);
        return (0, helpers_1.sendResponse)(res, 500, 'შეცდომა შეკვეთის განახლებისას', error);
    }
};
exports.distributionController = {
    getDistributionItem,
    getDistributionItems,
    updateDistributionItem,
};
//# sourceMappingURL=distribution.js.map