"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderServices = void 0;
const _lib_1 = require("@lib");
const _config_1 = require("@config");
const _helpers_1 = require("@helpers");
const _models_1 = require("@models");
const sequelize_1 = require("sequelize");
const addOrder = async (req, res, data) => {
    const transaction = await _lib_1.sequelize.transaction();
    try {
        let existingProducts = [];
        if (data.products && data.products.length > 0) {
            const productIds = data.products.map((product) => product.productId);
            existingProducts = await _models_1.Product.findAll({
                where: {
                    id: {
                        [sequelize_1.Op.in]: productIds,
                    },
                },
                transaction,
            });
            if (existingProducts.length !== data.products.length) {
                await transaction.rollback();
                return;
            }
        }
        const { products, ...orderData } = data;
        const newOrder = await _models_1.Order.create({
            ...orderData,
            status: _config_1.orderStatus[Number(data.status)],
        }, { transaction });
        const orderProducts = data.products.map((product) => ({
            orderId: newOrder.id,
            ...product,
        }));
        const createdOrderProducts = await _models_1.OrderProduct.bulkCreate(orderProducts, { transaction });
        if (createdOrderProducts.length === 0) {
            await transaction.rollback();
            return;
        }
        await transaction.commit();
        const orderId = newOrder.id;
        return orderId;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
const getOrder = async (req, res, id) => {
    try {
        const existingOrder = await _models_1.Order.findByPk(id, {
            attributes: {
                exclude: ['customerId'],
            },
            include: [
                {
                    model: _models_1.Customer,
                    as: 'customer',
                    attributes: {
                        include: ['createdAt', 'updatedAt', 'deletedAt'],
                    },
                },
                {
                    model: _models_1.Product,
                    as: 'products',
                    attributes: ['id', 'title', 'productCode', 'hasVAT'],
                    through: {
                        as: 'orderDetails',
                        attributes: ['quantity', 'weight', 'price'],
                    },
                },
            ],
        });
        if (!existingOrder)
            return {
                exists: false,
                order: null,
            };
        return {
            exists: true,
            order: existingOrder,
        };
    }
    catch (error) {
        throw error;
    }
};
const getOrders = async (req, res) => {
    try {
        const existingOrders = await _models_1.Order.findAll({
            attributes: {
                exclude: ['customerId'],
            },
            include: [
                {
                    model: _models_1.Customer,
                    as: 'customer',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'deletedAt'],
                    },
                },
                {
                    model: _models_1.Product,
                    as: 'products',
                    attributes: ['id', 'title', 'productCode', 'hasVAT'],
                    through: {
                        as: 'orderDetails',
                        attributes: ['quantity', 'weight', 'price'],
                    },
                },
            ],
        });
        if (existingOrders.length === 0)
            return {
                exists: false,
                orders: null,
            };
        return {
            exists: true,
            orders: existingOrders,
        };
    }
    catch (error) {
        throw error;
    }
};
const deleteOrder = async (req, res, id) => {
    const transaction = await _lib_1.sequelize.transaction();
    try {
        const foundOrder = await _models_1.Order.findByPk(id, { transaction });
        if (!foundOrder) {
            await transaction.rollback();
            return (0, _helpers_1.sendResponse)(res, 404, 'შეკვეთა მსგავსი საიდენტიფიკაციო კოდით ვერ მოიძებნა!');
        }
        await foundOrder.destroy({ transaction });
        // Verify the order is no longer in the database
        const checkDeleted = await _models_1.Order.findByPk(id, { transaction });
        if (checkDeleted) {
            await transaction.rollback();
            return (0, _helpers_1.sendResponse)(res, 500, 'შეკვეთის წაშლა ვერ მოხერხდა!');
        }
        await transaction.commit();
        return (0, _helpers_1.sendResponse)(res, 200, 'შეკვეთა წარმატებით წაიშალა!');
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
const updateOrder = async (req, res, data) => {
    const transaction = await _lib_1.sequelize.transaction();
    try {
        const existingOrder = await _models_1.Order.findByPk(data.id, { transaction });
        if (!existingOrder) {
            await transaction.rollback();
            return {
                exists: false,
                order: null,
            };
        }
        const { products, ...orderData } = data;
        // Update the order
        const updatedOrder = await existingOrder.update(orderData, { transaction });
        // Rebuild the `OrderProduct` associations
        const orderProducts = data.products.map((product) => ({
            orderId: updatedOrder.id,
            productId: product.productId,
            price: product.price,
            weight: product.weight,
            quantity: product.quantity,
        }));
        // Replace existing associations with the new ones
        await _models_1.OrderProduct.destroy({
            where: { orderId: updatedOrder.id },
            transaction,
        });
        await _models_1.OrderProduct.bulkCreate(orderProducts, { transaction });
        // Commit the transaction
        await transaction.commit();
        return {
            exists: true,
            order: updatedOrder,
        };
    }
    catch (error) {
        await transaction.rollback();
        console.error('Error updating order:', error);
        throw error;
    }
};
exports.orderServices = {
    addOrder,
    getOrder,
    getOrders,
    deleteOrder,
    updateOrder,
};
//# sourceMappingURL=order.js.map