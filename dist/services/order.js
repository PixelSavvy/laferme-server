"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderServices = void 0;
const _lib_1 = require("@lib");
const _helpers_1 = require("@helpers");
const _models_1 = require("@models");
const addOrder = async (req, res, data) => {
    const transaction = await _lib_1.sequelize.transaction();
    try {
        const existingCustomer = await _models_1.Customer.findByPk(data.customerId, { transaction });
        if (!existingCustomer) {
            await transaction.rollback();
            return;
        }
        const { products, ...order } = data;
        const newOrder = await _models_1.Order.create(order, { transaction });
        const orderProducts = data.products.map((product) => ({
            orderId: newOrder.id,
            ...product,
        }));
        await _models_1.OrderProduct.bulkCreate(orderProducts, { transaction });
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
                orders: existingOrders,
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
        // Fetch the existing order from DB
        const existingOrder = await _models_1.Order.findByPk(data.id, { transaction });
        // Handle the case where order does not exist
        if (!existingOrder) {
            await transaction.rollback();
            return {
                exists: false,
                message: 'Order not found',
            };
        }
        const { products, ...orderData } = data;
        // Update the order data (excluding products)
        const updatedOrder = await existingOrder.update(orderData, { transaction });
        // Check for product updates (add, update, delete)
        if (products && Array.isArray(products)) {
            // Find existing products associated with the order
            const existingOrderProducts = await _models_1.OrderProduct.findAll({
                where: { orderId: updatedOrder.id },
                transaction,
            });
            const existingProductIds = existingOrderProducts.map((p) => p.productId);
            const newProductIds = products.map((p) => p.productId);
            // Identify products to be added
            const productsToAdd = products.filter((p) => !existingProductIds.includes(p.productId));
            // Identify products to be updated (those that already exist)
            const productsToUpdate = products.filter((p) => existingProductIds.includes(p.productId));
            // Identify products to be removed (those that no longer exist in the new list)
            const productsToRemove = existingOrderProducts.filter((p) => !newProductIds.includes(p.productId));
            // 1. Remove old products no longer in the order
            await _models_1.OrderProduct.destroy({
                where: {
                    productId: productsToRemove.map((product) => product.productId),
                },
                transaction,
            });
            // 2. Add new products
            const orderProductsToAdd = productsToAdd.map((product) => ({
                orderId: updatedOrder.id,
                ...product,
            }));
            await _models_1.OrderProduct.bulkCreate(orderProductsToAdd, { transaction });
            // 3. Update existing products
            for (const product of productsToUpdate) {
                const orderProduct = existingOrderProducts.find((p) => p.productId === product.productId);
                if (orderProduct) {
                    await orderProduct.update(product, { transaction });
                }
            }
        }
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