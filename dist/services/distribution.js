"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distributionServices = void 0;
const _config_1 = require("@config");
const _helpers_1 = require("@helpers");
const _lib_1 = require("@lib");
const _models_1 = require("@models");
const sequelize_1 = require("sequelize");
const addDistributionItem = async (req, res, freezoneItemId) => {
    const transaction = await _lib_1.sequelize.transaction();
    try {
        const newDistributionItem = await _models_1.DistributionItem.create({
            freezoneItemId,
            status: _config_1.distributionStatus[3000],
        }, { transaction });
        // Fetch associated freezone products
        const freezoneItemProducts = await _models_1.FreezoneItemProduct.findAll({
            where: {
                freezoneItemId,
            },
            raw: true,
        });
        const transformedDistributionItemProducts = freezoneItemProducts.map((product) => ({
            ...product,
            distributionItemId: newDistributionItem.id,
            distributedWeight: 0,
        }));
        const distributionItemProducts = await _models_1.DistributionItemProduct.bulkCreate(transformedDistributionItemProducts, {
            transaction,
        });
        if (distributionItemProducts.length === 0)
            return;
        await transaction.commit();
        return newDistributionItem;
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
const getDistributionItem = async (req, res, id) => {
    try {
        const distributionItem = await _models_1.DistributionItem.findByPk(id, {
            attributes: {
                exclude: ['freezoneItemId'],
            },
            include: [
                {
                    model: _models_1.FreezoneItem,
                    as: 'freezone',
                },
                {
                    model: _models_1.Product,
                    as: 'products',
                    attributes: ['id', 'title', 'productCode'],
                    through: {
                        as: 'details',
                        attributes: ['adjustedWeight', 'adjustedQuantity', 'distributedWeight'],
                    },
                },
            ],
        });
        if (!distributionItem)
            return (0, _helpers_1.sendResponse)(res, 404, 'მსგავსი დისტრიბუცია ვერ მოიძებნა');
        return distributionItem;
    }
    catch (error) {
        throw error;
    }
};
const getDistributionItems = async (req, res) => {
    try {
        const existingDistributionItems = await _models_1.DistributionItem.findAll({
            include: [
                {
                    model: _models_1.FreezoneItem,
                    as: 'freezone',
                    attributes: ['orderId'],
                },
                {
                    model: _models_1.Product,
                    as: 'products',
                    attributes: ['id', 'title', 'productCode'],
                    through: {
                        as: 'distributionDetails',
                        attributes: ['adjustedWeight', 'distributedWeight', 'price'],
                    },
                },
            ],
        });
        if (existingDistributionItems.length === 0)
            return {
                exists: false,
                data: existingDistributionItems,
            };
        const orderIds = existingDistributionItems.map((item) => item.freezone.orderId);
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
        const transformedDistributionItems = existingDistributionItems.map((item) => {
            const order = customers.find((customer) => customer.id === item.freezone?.orderId);
            return {
                ...item.toJSON(),
                customer: order?.customer,
            };
        });
        return {
            exists: true,
            data: transformedDistributionItems,
        };
    }
    catch (error) {
        throw error;
    }
};
const updateDistributionItem = async (req, res, data) => {
    const transaction = await _lib_1.sequelize.transaction();
    try {
        const existingDistributionItem = await _models_1.DistributionItem.findByPk(data.id, { transaction });
        if (!existingDistributionItem) {
            await transaction.rollback();
            return {
                exists: false,
                data: existingDistributionItem,
            };
        }
        const { products, ...distributionItemData } = data;
        // Update the order
        const updatedDistributionItem = await existingDistributionItem.update(distributionItemData, { transaction });
        // Rebuild the `FreezoneItemProduct` associations
        const distributionItemProducts = data.products.map((product) => ({
            distributionItemId: updatedDistributionItem.id,
            productId: product.productId,
            price: product.price,
            adjustedWeight: product.adjustedWeight,
            distributedWeight: product.distributedWeight,
        }));
        // Replace existing associations with the new ones
        await _models_1.DistributionItemProduct.destroy({
            where: { distributionItemId: updatedDistributionItem.id },
            transaction,
        });
        await _models_1.DistributionItemProduct.bulkCreate(distributionItemProducts, { transaction });
        // Commit the transaction
        await transaction.commit();
        return {
            exists: true,
            order: updatedDistributionItem,
        };
    }
    catch (error) {
        await transaction.rollback();
        console.error('Error updating distribution item:', error);
        throw error;
    }
};
exports.distributionServices = {
    addDistributionItem,
    getDistributionItem,
    getDistributionItems,
    updateDistributionItem,
};
//# sourceMappingURL=distribution.js.map