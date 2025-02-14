import { Op } from "sequelize";
import { z } from "zod";

import { stagesObj, statusCodes } from "@/config";
import { transformOrders } from "@/helpers";
import { sequelize } from "@/lib";
import { Order, OrderProduct, OrderProductInstance, Product } from "@/models";
import { orderSchema } from "@/validators";

const addOne = async (data: z.infer<typeof orderSchema>) => {
  const transaction = await sequelize.transaction();

  try {
    if (!Array.isArray(data.products) || !data.products.length) {
      return {
        status: statusCodes.UNPROCESSABLE_ENTITY,
        message: "პროდუქტები სავალდებულოა",
        data: null,
      };
    }

    // Create a new order
    const newOrder = await Order.create(data, {
      transaction,
    });

    // Extract order product ids
    const orderProductsIds = data.products.map((product) => product.id);
    // Find products by ids
    const existingProducts = await Product.findAll({
      where: {
        id: orderProductsIds,
      },
      transaction,
    });

    // Check if all products are found
    if (existingProducts.length !== orderProductsIds.length) {
      await transaction.rollback();
      return {
        status: statusCodes.UNPROCESSABLE_ENTITY,
        message: "პროდუქტები ვერ მოიძებნა",
        data: null,
      };
    }

    const orderProducts = data.products.map((product) => {
      const { id, ...rest } = product;

      return {
        orderId: newOrder.id,
        productId: id,
        ...rest,
      };
    }) as OrderProductInstance[];

    const createdOrderProducts = await OrderProduct.bulkCreate(orderProducts, {
      transaction,
    });

    if (!createdOrderProducts.length) {
      await transaction.rollback();
      return {
        status: statusCodes.UNPROCESSABLE_ENTITY,
        message: "პროდუქტები ვერ დაემატა",
        data: null,
      };
    }

    await transaction.commit();

    return {
      status: statusCodes.CREATED,
      message: "შეკვეთა შექმნილია",
      data: newOrder,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getOne = async (id: string) => {
  const transaction = await sequelize.transaction();

  try {
    const order = await Order.findByPk(id, { transaction });

    if (!order) {
      await transaction.rollback();
      return {
        status: statusCodes.OK,
        message: "შეკვეთა ვერ მოიძებნა",
        data: {},
      };
    }

    const transformedOrder = transformOrders(order);

    await transaction.commit();
    return {
      status: statusCodes.OK,
      message: "შეკვეთა მოიძებნა",
      data: transformedOrder,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
const getAll = async () => {
  const transaction = await sequelize.transaction();

  try {
    const orders = await Order.findAll({
      transaction,
    });

    if (!orders.length) {
      await transaction.rollback();
      return {
        status: statusCodes.OK,
        message: "შეკვეთები ვერ მოიძებნა",
        data: [],
      };
    }

    const transformedOrders = transformOrders(orders);

    await transaction.commit();

    return {
      status: statusCodes.OK,
      message: "შეკვეთები მოიძებნა",
      data: transformedOrders,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const deleteOne = async (id: string) => {
  const transaction = await sequelize.transaction();

  try {
    const order = await Order.findByPk(id, { transaction });

    if (!order) {
      await transaction.rollback();
      return {
        status: statusCodes.OK,
        message: "შეკვეთა ვერ მოიძებნა",
        data: {},
      };
    }

    await order.destroy({ transaction });

    await transaction.commit();

    return {
      status: statusCodes.OK,
      message: "შეკვეთა წაიშალა",
      data: null,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateOne = async (id: string, data: z.infer<typeof orderSchema>) => {
  const transaction = await sequelize.transaction();

  try {
    const existingOrder = await Order.findByPk(id, {
      transaction,
    });

    if (!existingOrder) {
      await transaction.rollback();
      return {
        status: statusCodes.OK,
        message: "შეკვეთა ვერ მოიძებნა",
        data: {},
      };
    }

    // Calculate the total
    const total = data.products.reduce((sum, product) => {
      const price = product.price;
      const weight =
        data.stage === stagesObj.ORDER
          ? product.weight
          : data.stage === stagesObj.CLEANZONE
            ? product.preparedWeight
            : product.distributedWeight;

      return sum + price * (weight ?? 0);
    }, 0);

    const updatedOrder = await existingOrder.update(
      {
        ...data,
        total,
      },
      { transaction }
    );

    if (!Array.isArray(data.products) || !data.products.length) {
      await transaction.commit();

      return {
        status: statusCodes.OK,
        message: "შეკვეთა განახლდა",
        data: updatedOrder,
      };
    }

    // Handle product updates
    const orderProductsIds = data.products.map((product) => product.id);

    const orderProducts = data.products.map((product) => {
      const { id, ...rest } = product;
      return {
        orderId: updatedOrder.id,
        productId: id,
        ...rest,
      };
    });

    await OrderProduct.destroy({
      where: {
        orderId: updatedOrder.id,
        productId: {
          [Op.notIn]: orderProductsIds,
        },
      },
      transaction,
    });

    const updatedOrderProducts = await OrderProduct.bulkCreate(orderProducts, {
      updateOnDuplicate: ["price", "quantity", "weight", "preparedQuantity", "preparedWeight", "distributedWeight"],
      transaction,
    });

    if (!updatedOrderProducts.length) {
      await transaction.rollback();
      return {
        status: statusCodes.UNPROCESSABLE_ENTITY,
        message: "პროდუქტები ვერ განახლდა",
        data: null,
      };
    }

    await transaction.commit();

    return {
      status: statusCodes.OK,
      message: "შეკვეთა განახლდა",
      data: {
        ...updatedOrder.toJSON(),
        products: updatedOrderProducts,
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const orderService = {
  addOne,
  getOne,
  getAll,
  deleteOne,
  updateOne,
};
