import { sendResponse } from '@helpers';
import { sequelize } from '@lib';
import { Customer, FreezoneItem, FreezoneItemProduct, Order, OrderProduct, Product } from '@models';
import { freezoneItemSchema, orderSchema } from '@validations';
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { z } from 'zod';

const addFreezoneItem = async (req: Request, res: Response, orderId: number) => {
  const transaction = await sequelize.transaction();
  try {
    // Fetch associated order
    const order = await Order.findByPk(orderId, {
      transaction,
      raw: true,
    });

    if (!order) return;

    // Create a freezoneItem
    const newFreezoneItem = await FreezoneItem.create(
      {
        id: orderId,
        orderId: orderId,
        status: order.status,
      },
      { transaction }
    );

    // Fetch associated order products
    const orderProducts = await OrderProduct.findAll({
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

    const freezoneItemProducts = await FreezoneItemProduct.bulkCreate(transformedFreezoneItemProducts, { transaction });

    if (freezoneItemProducts.length === 0) return;

    await transaction.commit();

    const freezoneItemId = newFreezoneItem.id;

    return freezoneItemId;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getFreezoneItem = async (req: Request, res: Response, id: number) => {
  try {
    const freezoneItem = await FreezoneItem.findByPk(id, {
      include: [
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'title', 'productCode'],
          through: {
            as: 'freezoneDetails',
            attributes: ['weight', 'quantity', 'adjustedWeight', 'adjustedQuantity'],
          },
        },
      ],
    });

    if (!freezoneItem) return sendResponse(res, 404, 'მსგავსი შეკვეთა თავისუფალ ზონაში ვერ მოიძებნა');

    return freezoneItem;
  } catch (error) {
    throw error;
  }
};

const getFreezoneItems = async (req: Request, res: Response, id: number) => {
  try {
    const existingFreezoneItems = await FreezoneItem.findAll({
      include: [
        {
          model: Product,
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

    const customers = await Order.findAll({
      where: {
        [Op.or]: {
          id: orderIds,
        },
      },
      include: [
        {
          model: Customer,
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

const updateFreezoneItem = async (req: Request, res: Response, data: z.infer<typeof freezoneItemSchema>) => {
  const transaction = await sequelize.transaction();

  try {
    const existingFreezoneItem = await FreezoneItem.findByPk(data.id, { transaction });

    if (!existingFreezoneItem) {
      await transaction.rollback();
      return {
        exists: false,
        freezoneItem: existingFreezoneItem,
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
    await FreezoneItemProduct.destroy({
      where: { freezoneItemId: updatedFreezoneItem.id },
      transaction,
    });

    await FreezoneItemProduct.bulkCreate(freezoneItemProducts, { transaction });

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

const updateOrderFreezoneItem = async (data: z.infer<typeof orderSchema>) => {
  const transaction = await sequelize.transaction();

  try {
    const existingFreezoneItem = await FreezoneItem.findOne({
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

    const existingFreezoneItemProducts = await FreezoneItemProduct.findAll({
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

    await FreezoneItemProduct.bulkCreate(updatedFreezoneItemProducts, {
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

export const freezoneServices = {
  addFreezoneItem,
  getFreezoneItem,
  getFreezoneItems,
  updateFreezoneItem,
  updateOrderFreezoneItem,
};
