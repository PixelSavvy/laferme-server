'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.freezoneServices = void 0;
const _helpers_1 = require('@helpers');
const _lib_1 = require('@lib');
const _models_1 = require('@models');
const sequelize_1 = require('sequelize');
const addFreezoneItem = async (req, res, orderId) => {
  const transaction = await _lib_1.sequelize.transaction();
  try {
    // Fetch associated order
    const order = await _models_1.Order.findByPk(orderId, {
      transaction,
      raw: true,
    });
    if (!order) return;
    // Create a freezoneItem
    const newFreezoneItem = await _models_1.FreezoneItem.create(
      {
        id: orderId,
        orderId: orderId,
        status: order.status,
      },
      { transaction }
    );
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
    const freezoneItemProducts = await _models_1.FreezoneItemProduct.bulkCreate(transformedFreezoneItemProducts, {
      transaction,
    });
    if (freezoneItemProducts.length === 0) return;
    await transaction.commit();
    const freezoneItemId = newFreezoneItem.id;
    return freezoneItemId;
  } catch (error) {
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
    if (!freezoneItem) return (0, _helpers_1.sendResponse)(res, 404, 'მსგავსი შეკვეთა თავისუფალ ზონაში ვერ მოიძებნა');
    return freezoneItem;
  } catch (error) {
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
  } catch (error) {
    throw error;
  }
};
const updateFreezoneItem = async (req, res, data) => {
  const transaction = await _lib_1.sequelize.transaction();
  try {
    const existingFreezoneItem = await _models_1.FreezoneItem.findByPk(data.id, { transaction });
    if (!existingFreezoneItem) {
      await transaction.rollback();
      return {
        exists: false,
        freezoneItem: existingFreezoneItem,
      };
    }
    const { products, ...freezoneItemData } = data;
    // Update the order
    const updatedFreezoneItem = await existingFreezoneItem.update(freezoneItemData, { transaction });
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
    await _models_1.FreezoneItemProduct.destroy({
      where: { freezoneItemId: updatedFreezoneItem.id },
      transaction,
    });
    await _models_1.FreezoneItemProduct.bulkCreate(freezoneItemProducts, { transaction });
    // Commit the transaction
    await transaction.commit();
    return {
      exists: true,
      order: updatedFreezoneItem,
    };
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating freezone item:', error);
    throw error;
  }
};
const updateOrderFreezoneItem = async (data) => {
  const transaction = await _lib_1.sequelize.transaction();
  try {
    const existingFreezoneItem = await _models_1.FreezoneItem.findOne({
      where: { orderId: data.id },
      transaction,
    });
    if (!existingFreezoneItem) {
      return { exists: false, freezoneItem: null };
    }
    const products = data.products.map((product) => ({
      freezoneItemId: existingFreezoneItem.id,
      productId: product.productId,
      price: product.price,
      weight: product.weight,
      quantity: product.quantity,
    }));
    const existingFreezoneItemProducts = await _models_1.FreezoneItemProduct.findAll({
      where: {
        freezoneItemId: existingFreezoneItem.id,
      },
      transaction,
    });
    const updatedFreezoneItemProducts = existingFreezoneItemProducts.map((existingProduct) => {
      const product = products.find((p) => p.productId === existingProduct.productId);
      if (!product) return existingProduct;
      return {
        freezoneItemId: data.id,
        productId: product.productId,
        price: product.price,
        weight: product.weight,
        quantity: product.quantity,
        adjustedWeight: existingProduct.adjustedWeight,
        adjustedQuantity: existingProduct.adjustedQuantity,
      };
    });
    await _models_1.FreezoneItemProduct.bulkCreate(updatedFreezoneItemProducts, {
      updateOnDuplicate: ['price', 'weight', 'quantity', 'adjustedWeight', 'adjustedQuantity'],
      transaction,
    });
    // Commit the transaction
    await transaction.commit();
    return { exists: true, freezoneItem: existingFreezoneItem };
  } catch (error) {
    await transaction.rollback();
    throw error; // Rethrow the error to be handled by your error handler
  }
};
exports.freezoneServices = {
  addFreezoneItem,
  getFreezoneItem,
  getFreezoneItems,
  updateFreezoneItem,
  updateOrderFreezoneItem,
};
//# sourceMappingURL=freezone.js.map
