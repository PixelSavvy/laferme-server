"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.freezoneServices = void 0;
const _helpers_1 = require("@helpers");
const _lib_1 = require("@lib");
const _models_1 = require("@models");
const sequelize_1 = require("sequelize");
const addFreezoneItem = async (req, res, orderId) => {
    const transaction = await _lib_1.sequelize.transaction();
    try {
        // Fetch associated order
        const order = await _models_1.Order.findByPk(orderId, {
            transaction,
            raw: true,
        });
        if (!order)
            return;
        // Create a freezoneItem
        const newFreezoneItem = await _models_1.FreezoneItem.create({
            id: orderId,
            orderId: orderId,
            status: order.status,
            customerId: order.customerId,
        }, { transaction });
        // Fetch associated order products
        const orderProducts = await _models_1.OrderProduct.findAll({
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
        const freezoneItemProducts = await _models_1.FreezoneItemProduct.bulkCreate(transformedFreezoneItemProducts, { transaction });
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
        const freezoneItem = await _models_1.FreezoneItem.findByPk(id, {
            include: [
                {
                    model: _models_1.Product,
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
            return (0, _helpers_1.sendResponse)(res, 404, 'მსგავსი შეკვეთა თავისუფალ ზონაში ვერ მოიძებნა');
        return freezoneItem;
    }
    catch (error) {
        throw error;
    }
};
const getFreezoneItems = async (req, res, id) => {
    try {
        const existingFreezoneItems = await _models_1.FreezoneItem.findAll({
            include: [
                {
                    model: _models_1.Product,
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
        const customers = await _models_1.Order.findAll({
            where: {
                [sequelize_1.Op.or]: {
                    id: orderIds,
                },
            },
            include: [
                {
                    model: _models_1.Customer,
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
    const transaction = await _lib_1.sequelize.transaction();
    try {
        // Fetch the existing freezone item
        const existingFreezoneItem = await _models_1.FreezoneItem.findOne({
            where: { id: data.id, orderId: data.id },
            attributes: ['id'],
            transaction,
        });
        // If the freezone item does not exist, return an error
        if (!existingFreezoneItem) {
            await transaction.rollback();
            return {
                exists: false,
                freezoneItem: existingFreezoneItem,
            };
        }
        // Rebuild the `FreezoneItemProduct` associations
        const freezoneItemProducts = data.products.map((product) => ({
            ...product,
        }));
        // Replace existing associations with the new ones
        await _models_1.FreezoneItemProduct.bulkCreate(freezoneItemProducts, {
            transaction,
            updateOnDuplicate: ['adjustedWeight', 'adjustedQuantity'],
        });
        // Commit the transaction
        await transaction.commit();
        return {
            exists: true,
            freezoneItem: existingFreezoneItem,
        };
    }
    catch (error) {
        await transaction.rollback();
        console.error('Error updating freezone item:', error);
        throw error;
    }
};
const updateFreezoneItemOnOrderUpdate = async (req, res, data) => {
    const transaction = await _lib_1.sequelize.transaction();
    try {
        const { products: orderProducts, id: orderId } = data;
        // Fetch all the products associated with the current freezoneItemId (orderId)
        const existingProducts = await _models_1.FreezoneItemProduct.findAll({
            where: {
                freezoneItemId: orderId,
            },
            transaction,
        });
        // Prepare the updated products list, removed products, and new products
        const updatedProducts = [];
        const removedProducts = [];
        const newProducts = [];
        for (const product of existingProducts) {
            const updatedProduct = orderProducts.find((p) => p.productId === product.productId);
            // If the product is updated, check if there's any difference
            if (updatedProduct) {
                const isUpdated = product.quantity !== updatedProduct.quantity ||
                    product.weight !== updatedProduct.weight ||
                    product.price !== updatedProduct.price;
                if (isUpdated) {
                    updatedProducts.push({
                        ...product.get(), // Get the original data values
                        ...updatedProduct, // Merge updated data
                    });
                }
            }
            else {
                // If the product is not in orderProducts, mark it for removal
                removedProducts.push(product);
            }
        }
        // Add new products that do not exist in existing products
        for (const product of orderProducts) {
            const existingProduct = existingProducts.find((p) => p.productId === product.productId);
            if (!existingProduct) {
                newProducts.push({
                    freezoneItemId: orderId,
                    adjustedQuantity: 0, // Set adjustedQuantity to 0 for new products
                    adjustedWeight: 0, // Set adjustedWeight to 0 for new products
                    ...product, // Merge product data
                });
            }
        }
        // Delete removed products from FreezoneItemProduct
        await Promise.all(removedProducts.map((product) => {
            return product.destroy({ transaction });
        }));
        // Insert or update existing products
        await _models_1.FreezoneItemProduct.bulkCreate(updatedProducts, {
            updateOnDuplicate: ['price', 'quantity', 'weight'], // Fields to be updated if the product already exists
            transaction,
        });
        // Insert new products that were added
        if (newProducts.length > 0) {
            await _models_1.FreezoneItemProduct.bulkCreate(newProducts, {
                transaction,
            });
        }
        // Commit the transaction
        await transaction.commit();
        return {
            success: true,
        };
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
const deleteFreezoneItem = async (req, res, id) => {
    const transaction = await _lib_1.sequelize.transaction();
    try {
        // Fetch the existing freezone item
        const existingFreezoneItem = await _models_1.FreezoneItem.findOne({
            where: { id },
            transaction,
        });
        // If the freezone item does not exist, return an error
        if (!existingFreezoneItem) {
            await transaction.rollback();
            return {
                exists: false,
                freezoneItem: existingFreezoneItem,
            };
        }
        // Delete the freezone item
        await existingFreezoneItem.destroy({ transaction });
        // Delete all associated products
        await _models_1.FreezoneItemProduct.destroy({
            where: {
                freezoneItemId: id,
            },
            transaction,
        });
        // Commit the transaction
        await transaction.commit();
        return {
            exists: true,
            freezoneItem: existingFreezoneItem,
        };
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
exports.freezoneServices = {
    addFreezoneItem,
    getFreezoneItem,
    getFreezoneItems,
    updateFreezoneItem,
    updateFreezoneItemOnOrderUpdate,
    deleteFreezoneItem,
};
//# sourceMappingURL=freezone.js.map