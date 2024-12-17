"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.freezoneServices = void 0;
const helpers_1 = require("@/helpers");
const lib_1 = require("@/lib");
const models_1 = require("@/models");
const sequelize_1 = require("sequelize");
const addFreezoneItem = async (req, res, orderId) => {
    const transaction = await lib_1.sequelize.transaction();
    try {
        // Fetch associated order
        const order = await models_1.Order.findByPk(orderId, {
            transaction,
            raw: true,
        });
        if (!order)
            return;
        // Create a freezoneItem
        const newFreezoneItem = await models_1.FreezoneItem.create({
            orderId: orderId,
            status: order.status,
        }, { transaction });
        // Fetch associated order products
        const orderProducts = await models_1.OrderProduct.findAll({
            where: {
                orderId: order.id,
            },
            raw: true,
        });
        const transformedFreezoneItemProducts = orderProducts.map((product) => ({
            ...product,
            freezoneItemId: newFreezoneItem.id,
            adjustedWeight: 0,
            adjustedQuantity: 0,
        }));
        const freezoneItemProducts = await models_1.FreezoneItemProduct.bulkCreate(transformedFreezoneItemProducts, { transaction });
        if (freezoneItemProducts.length === 0)
            return;
        await transaction.commit();
        const freezoneItemId = newFreezoneItem.id;
        return freezoneItemId;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
const getFreezoneItem = async (req, res, id) => {
    try {
        const freezoneItem = await models_1.FreezoneItem.findByPk(id, {
            include: [
                {
                    model: models_1.Product,
                    as: 'products',
                    attributes: ['id', 'title', 'productCode'],
                    through: {
                        as: 'freezoneDetails',
                        attributes: ['weight', 'quantity', 'adjustedWeight', 'adjustedQuantity'],
                    },
                },
            ],
        });
        if (!freezoneItem)
            return (0, helpers_1.sendResponse)(res, 404, 'მსგავსი შეკვეთა თავისუფალ ზონაში ვერ მოიძებნა');
        return freezoneItem;
    }
    catch (error) {
        throw error;
    }
};
const getFreezoneItems = async (req, res, id) => {
    try {
        const existingFreezoneItems = await models_1.FreezoneItem.findAll({
            include: [
                {
                    model: models_1.Product,
                    as: 'products',
                    attributes: ['id', 'title', 'productCode'],
                    through: {
                        as: 'freezoneDetails',
                        attributes: ['weight', 'quantity', 'adjustedWeight', 'adjustedQuantity', 'price'],
                    },
                },
            ],
        });
        if (existingFreezoneItems.length === 0)
            return {
                exists: false,
                freezoneItems: existingFreezoneItems,
            };
        const orderIds = existingFreezoneItems.map((item) => item.orderId);
        const customers = await models_1.Order.findAll({
            where: {
                [sequelize_1.Op.or]: {
                    id: orderIds,
                },
            },
            include: [
                {
                    model: models_1.Customer,
                    as: 'customer',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'deletedAt'],
                    },
                },
            ],
        });
        const transformedFreezoneItems = existingFreezoneItems.map((item) => {
            const order = customers.find((customer) => customer.id === item.orderId);
            return {
                ...item.toJSON(),
                customer: order?.customer,
            };
        });
        return {
            exists: true,
            freezoneItems: transformedFreezoneItems,
        };
    }
    catch (error) {
        throw error;
    }
};
const updateFreezoneItem = async (req, res, data) => {
    const transaction = await lib_1.sequelize.transaction();
    try {
        const existingFreezoneItem = await models_1.FreezoneItem.findByPk(data.id, { transaction });
        if (!existingFreezoneItem) {
            await transaction.rollback();
            return {
                exists: false,
                freezoneItem: null,
            };
        }
        // Update the order
        const updatedFreezoneItem = await existingFreezoneItem.update(data, { transaction });
        // Rebuild the `FreezoneItemProduct` associations
        const freezoneItemProducts = data.products.map((product) => ({
            freezoneItemId: updatedFreezoneItem.id,
            productId: product.productId,
            price: product.price,
            weight: product.weight,
            quantity: product.quantity,
            adjustedWeight: product.adjustedWeight,
            adjustedQuantity: product.adjustedQuantity,
        }));
        // Replace existing associations with the new ones
        await models_1.FreezoneItemProduct.destroy({
            where: { freezoneItemId: updatedFreezoneItem.id },
            transaction,
        });
        await models_1.FreezoneItemProduct.bulkCreate(freezoneItemProducts, { transaction });
        // Commit the transaction
        await transaction.commit();
        return {
            exists: true,
            order: updatedFreezoneItem,
        };
    }
    catch (error) {
        await transaction.rollback();
        console.error('Error updating freezone item:', error);
        throw error;
    }
};
exports.freezoneServices = {
    addFreezoneItem,
    getFreezoneItem,
    getFreezoneItems,
    updateFreezoneItem,
};
//# sourceMappingURL=freezone.js.map