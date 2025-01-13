import { Request, Response } from "express";
import { z } from "zod";

import { sequelize } from "@/lib";

import { sendResponse } from "@/helpers";
import { Customer, DistributionItem, FreezoneItem, Order, OrderProduct, Product } from "@/models";
import { newOrderSchema, updateOrderSchema } from "@/validators";

const addOrder = async (req: Request, res: Response, data: z.infer<typeof newOrderSchema>) => {
  const transaction = await sequelize.transaction();
  try {
    const existingCustomer = await Customer.findByPk(data.customerId, {
      transaction,
    });

    if (!existingCustomer) {
      await transaction.rollback();
      return;
    }

    const { products, ...order } = data;

    const newOrder = await Order.create(order, { transaction });

    const orderProducts = data.products.map((product) => ({
      orderId: newOrder.id,
      ...product,
    }));

    await OrderProduct.bulkCreate(orderProducts, { transaction });

    await transaction.commit();

    const orderId = newOrder.id;

    return orderId;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getOrder = async (req: Request, res: Response, id: number) => {
  try {
    const existingOrder = await Order.findByPk(id, {
      attributes: {
        exclude: ["customerId"],
      },
      include: [
        {
          model: Customer,
          as: "customer",
          attributes: {
            include: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
        {
          model: Product,
          as: "products",
          attributes: ["id", "title", "productCode", "hasVAT"],
          through: {
            as: "orderDetails",
            attributes: ["quantity", "weight", "price"],
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
  } catch (error) {
    throw error;
  }
};

const getOrders = async (req: Request, res: Response) => {
  try {
    const existingOrders = await Order.findAll({
      attributes: {
        exclude: ["customerId"],
      },
      include: [
        {
          model: Customer,
          as: "customer",
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
        {
          model: Product,
          as: "products",
          attributes: ["id", "title", "productCode", "hasVAT"],
          through: {
            as: "orderDetails",
            attributes: ["quantity", "weight", "price"],
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
  } catch (error) {
    throw error;
  }
};

const deleteOrder = async (req: Request, res: Response, id: number) => {
  const transaction = await sequelize.transaction();
  try {
    const existingOrder = await Order.findByPk(id, { transaction });
    const existingFreezoneItem = await FreezoneItem.findByPk(id, { transaction });
    const existingDistributionItem = await DistributionItem.findByPk(id, { transaction });

    // If Order and FreezoneItem do not exist, return early
    if (!existingOrder || !existingFreezoneItem) {
      await transaction.rollback();
      return sendResponse(res, 404, "Order or Freezone Item not found.");
    }

    // Delete DistributionItem if it exists
    if (existingDistributionItem) {
      await existingDistributionItem.destroy({ transaction });
      console.log("Distribution item deleted successfully");
    }
    // Delete FreezoneItem and Order
    await existingFreezoneItem.destroy({ transaction });
    await existingOrder.destroy({ transaction });

    console.log("Order and FreezoneItem deleted successfully");

    await transaction.commit();
    return sendResponse(res, 200, "Order and associated items deleted successfully.");
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateOrder = async (req: Request, res: Response, data: z.infer<typeof updateOrderSchema>) => {
  const transaction = await sequelize.transaction();

  try {
    // Fetch the existing order from DB
    const existingOrder = await Order.findByPk(data.id, { transaction });

    // Handle the case where order does not exist
    if (!existingOrder) {
      await transaction.rollback();
      return {
        exists: false,
        message: "Order not found",
      };
    }

    const { products, ...orderData } = data;

    // Update the order data (excluding products)
    const updatedOrder = await existingOrder.update(orderData, { transaction });

    // Check for product updates (add, update, delete)
    if (products && Array.isArray(products)) {
      // Find existing products associated with the order
      const existingOrderProducts = await OrderProduct.findAll({
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
      await OrderProduct.destroy({
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

      await OrderProduct.bulkCreate(orderProductsToAdd, { transaction });

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
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating order:", error);
    throw error;
  }
};

export const updateOrderStatus = async (req: Request, res: Response, id: number, status: string) => {
  const transaction = await sequelize.transaction();

  try {
    // Fetch the existing order from DB
    const existingOrder = await Order.findByPk(id, { transaction });

    // Handle the case where order does not exist
    if (!existingOrder) {
      await transaction.rollback();
      return {
        exists: false,
        existingOrder: null,
      };
    }

    // Update the order status
    await existingOrder.update({ status }, { transaction });

    // Commit the transaction
    await transaction.commit();

    return {
      exists: true,
      existingOrder,
    };
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const orderServices = {
  addOrder,
  getOrder,
  getOrders,
  deleteOrder,
  updateOrder,
  updateOrderStatus,
};
