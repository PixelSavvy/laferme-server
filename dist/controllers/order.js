"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const _helpers_1 = require("@helpers");
const _lib_1 = require("@lib");
const _services_1 = require("@services");
const _validations_1 = require("@validations");
const addOrder = async (req, res) => {
    const transaction = await _lib_1.sequelize.transaction();
    const data = req.body;
    const parsedData = _validations_1.newOrderSchema.safeParse(data);
    if (!parsedData.success)
        return (0, _helpers_1.sendResponse)(res, 400, 'Validation error', parsedData.error.format());
    try {
        const orderId = await _services_1.orderServices.addOrder(req, res, parsedData.data);
        if (!orderId) {
            await transaction.rollback();
            return (0, _helpers_1.sendResponse)(res, 500, 'შეცდომა შეკვეთის შექმნისას');
        }
        const freezoneItemId = await _services_1.freezoneServices.addFreezoneItem(req, res, orderId);
        if (!freezoneItemId) {
            await transaction.rollback();
            return (0, _helpers_1.sendResponse)(res, 500, 'შეცდომა შეკვეთის თავისუფალ ზონაში დამატებისას');
        }
        await transaction.commit();
        return (0, _helpers_1.sendResponse)(res, 201, `შეკვეთა წარმატებით დაემატა`, freezoneItemId);
    }
    catch (error) {
        await transaction.rollback();
        console.error('Error adding an order:', error);
        return (0, _helpers_1.sendResponse)(res, 500, 'შეცდომა შეკვეთის შექმნისას', error);
    }
};
const getOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await _services_1.orderServices.getOrder(req, res, Number(id));
        if (!order.exists)
            return (0, _helpers_1.sendResponse)(res, 202, 'შეკვეთა ვერ მოიძებნა', order.order);
        return (0, _helpers_1.sendResponse)(res, 201, 'შეკვეთა წარმატებით მოიძებნა!', order.order);
    }
    catch (error) {
        console.error('Error fetching an order', error);
        return (0, _helpers_1.sendResponse)(res, 500, 'შეცდომა შეკვეთის ძებნისას', error);
    }
};
const getOrders = async (req, res) => {
    try {
        const foundOrders = await _services_1.orderServices.getOrders(req, res);
        if (!foundOrders.exists)
            return (0, _helpers_1.sendResponse)(res, 202, 'შეკვეთები ვერ მოიძებნა', foundOrders.orders);
        return (0, _helpers_1.sendResponse)(res, 200, 'შეკვეთები წარმატებით მოიძებნა', foundOrders.orders);
    }
    catch (error) {
        console.error(error);
        return (0, _helpers_1.sendResponse)(res, 500, 'შეცდომა შეკვეთების ძებნისას', error);
    }
};
const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        await _services_1.orderServices.deleteOrder(req, res, Number(id));
        await _services_1.freezoneServices.deleteFreezoneItem(req, res, Number(id));
    }
    catch (error) {
        console.error('Error deleting an order:', error);
        return (0, _helpers_1.sendResponse)(res, 500, 'შეცდომა შეკვეთის წაშლისას', error);
    }
};
const updateOrder = async (req, res) => {
    const data = req.body;
    const transaction = await _lib_1.sequelize.transaction();
    const parsedData = _validations_1.updateOrderSchema.safeParse(data);
    if (!parsedData.success)
        return (0, _helpers_1.sendResponse)(res, 400, 'Validation error', parsedData.error.format());
    try {
        const updatedOrder = await _services_1.orderServices.updateOrder(req, res, parsedData.data);
        if (!updatedOrder.exists) {
            await transaction.rollback();
            return (0, _helpers_1.sendResponse)(res, 404, 'შეკვეთა ვერ მოიძებნა', updatedOrder.order);
        }
        const updatedFreezoneItem = await _services_1.freezoneServices.updateFreezoneItemOnOrderUpdate(req, res, parsedData.data);
        if (!updatedFreezoneItem.success) {
            await transaction.rollback();
            return (0, _helpers_1.sendResponse)(res, 500, 'შეცდომა შეკვეთის თავისუფალ ზონის განახლებისას');
        }
        await transaction.commit();
        return (0, _helpers_1.sendResponse)(res, 200, 'შეკვეთა წარმატებით განახლდა');
    }
    catch (error) {
        await transaction.rollback();
        console.error('Error updating an order:', error);
        return (0, _helpers_1.sendResponse)(res, 500, 'შეცდომა შეკვეთის განახლებისას', error);
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