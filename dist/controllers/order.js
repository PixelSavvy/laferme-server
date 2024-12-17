"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const helpers_1 = require("@/helpers");
const services_1 = require("@/services");
const validations_1 = require("@/validations");
const addOrder = async (req, res) => {
    const data = req.body;
    const parsedData = validations_1.newOrderSchema.safeParse(data);
    if (!parsedData.success)
        return (0, helpers_1.sendResponse)(res, 400, 'Validation error', parsedData.error.format());
    try {
        const orderId = await services_1.orderServices.addOrder(req, res, parsedData.data);
        if (!orderId)
            return;
        const freezoneItemId = await services_1.freezoneServices.addFreezoneItem(req, res, orderId);
        if (!freezoneItemId)
            return;
        const distributionItem = await services_1.distributionServices.addDistributionItem(req, res, freezoneItemId);
        return (0, helpers_1.sendResponse)(res, 201, `შეკვეთა წარმატებით დაემატა; შეკვეთა წარმატებით დაემატა თავისუფალ ზონაში; შეკვეთა წარმატებით დაემატა დისტრიბუციაში`, distributionItem);
    }
    catch (error) {
        console.error('Error adding an order:', error);
        return (0, helpers_1.sendResponse)(res, 500, 'შეცდომა შეკვეთის შექმნისას', error);
    }
};
const getOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await services_1.orderServices.getOrder(req, res, Number(id));
        if (!order.exists)
            return (0, helpers_1.sendResponse)(res, 404, 'შეკვეთა ვერ მოიძებნა', order.order);
        return (0, helpers_1.sendResponse)(res, 201, 'შეკვეთა წარმატებით მოიძებნა!', order.order);
    }
    catch (error) {
        console.error('Error fetching an order', error);
        return (0, helpers_1.sendResponse)(res, 500, 'შეცდომა შეკვეთის ძებნისას', error);
    }
};
const getOrders = async (req, res) => {
    try {
        const foundOrders = await services_1.orderServices.getOrders(req, res);
        if (!foundOrders.exists)
            return (0, helpers_1.sendResponse)(res, 404, 'შეკვეთები ვერ მოიძებნა', foundOrders.orders);
        return (0, helpers_1.sendResponse)(res, 200, 'შეკვეთები წარმატებით მოიძებნა', foundOrders.orders);
    }
    catch (error) {
        console.error(error);
        return (0, helpers_1.sendResponse)(res, 500, 'შეცდომა შეკვეთების ძებნისას', error);
    }
};
const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        await services_1.orderServices.deleteOrder(req, res, Number(id));
    }
    catch (error) {
        console.error('Error deleting an order:', error);
        return (0, helpers_1.sendResponse)(res, 500, 'შეცდომა შეკვეთის წაშლისას', error);
    }
};
const updateOrder = async (req, res) => {
    const data = req.body;
    const parsedData = validations_1.orderSchema.safeParse(data);
    if (!parsedData.success)
        return (0, helpers_1.sendResponse)(res, 400, 'Validation error', parsedData.error.format());
    try {
        const updatedOrder = await services_1.orderServices.updateOrder(req, res, parsedData.data);
        if (!updatedOrder.exists)
            return (0, helpers_1.sendResponse)(res, 404, 'შეკვეთა ვერ მოიძებნა', updatedOrder.order);
        return (0, helpers_1.sendResponse)(res, 200, 'შეკვეთა წარმატებით განახლდა', updatedOrder.order);
    }
    catch (error) {
        console.error('Error updating an order:', error);
        return (0, helpers_1.sendResponse)(res, 500, 'შეცდომა შეკვეთის განახლებისას', error);
    }
};
exports.orderController = {
    addOrder,
    getOrder,
    getOrders,
    deleteOrder,
    updateOrder,
};
//# sourceMappingURL=order.js.map