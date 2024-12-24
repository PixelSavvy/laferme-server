import { sendResponse } from "@/helpers";
import { sequelize } from "@/lib";
import { Customer, FreezoneItem, FreezoneItemProduct, Order, OrderProduct, Product } from "@/models";
import { updateFreezoneItemSchema, updateFreezoneItemStatusSchema, updateOrderSchema } from "@/validators";
import { Request, Response } from "express";
import { Op } from "sequelize";
import { z } from "zod";

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
        customerId: order.customerId,
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
          as: "products",
          attributes: ["id", "title", "productCode"],
          through: {
            as: "freezoneDetails",
            attributes: ["weight", "quantity", "adjustedWeight", "adjustedQuantity"],
          },
        },
      ],
    });

    if (!freezoneItem) return sendResponse(res, 404, "მსგავსი შეკვეთა თავისუფალ ზონაში ვერ მოიძებნა");

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
          as: "products",
          attributes: ["id", "title", "productCode"],
          through: {
            as: "freezoneDetails",
            attributes: ["weight", "quantity", "adjustedWeight", "adjustedQuantity", "price"],
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
          as: "customer",
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
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

const updateFreezoneItem = async (req: Request, res: Response, data: z.infer<typeof updateFreezoneItemSchema>) => {
  const transaction = await sequelize.transaction();

  try {
    // Fetch the existing freezone item
    const existingFreezoneItem = await FreezoneItem.findOne({
      where: { id: data.id, orderId: data.id },
      attributes: ["id"],
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
    await FreezoneItemProduct.bulkCreate(freezoneItemProducts, {
      transaction,
      updateOnDuplicate: ["adjustedWeight", "adjustedQuantity"],
    });

    // Commit the transaction
    await transaction.commit();

    return {
      exists: true,
      freezoneItem: existingFreezoneItem,
    };
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating freezone item:", error);
    throw error;
  }
};

const updateFreezoneItemOnOrderUpdate = async (req: Request, res: Response, data: z.infer<typeof updateOrderSchema>) => {
  const transaction = await sequelize.transaction();

  try {
    const { products: orderProducts, id: orderId } = data;

    // Fetch all the products associated with the current freezoneItemId (orderId)
    const existingProducts = await FreezoneItemProduct.findAll({
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
        const isUpdated =
          product.quantity !== updatedProduct.quantity ||
          product.weight !== updatedProduct.weight ||
          product.price !== updatedProduct.price;

        if (isUpdated) {
          updatedProducts.push({
            ...product.get(), // Get the original data values
            ...updatedProduct, // Merge updated data
          });
        }
      } else {
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
    await Promise.all(
      removedProducts.map((product) => {
        return product.destroy({ transaction });
      })
    );

    // Insert or update existing products
    await FreezoneItemProduct.bulkCreate(updatedProducts, {
      updateOnDuplicate: ["price", "quantity", "weight"], // Fields to be updated if the product already exists
      transaction,
    });

    // Insert new products that were added
    if (newProducts.length > 0) {
      await FreezoneItemProduct.bulkCreate(newProducts, {
        transaction,
      });
    }

    // Commit the transaction
    await transaction.commit();

    return {
      success: true,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const deleteFreezoneItem = async (req: Request, res: Response, id: number) => {
  const transaction = await sequelize.transaction();

  try {
    // Fetch the existing freezone item
    const existingFreezoneItem = await FreezoneItem.findOne({
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
    await FreezoneItemProduct.destroy({
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
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateFreezoneItemStatus = async (
  req: Request,
  res: Response,
  data: z.infer<typeof updateFreezoneItemStatusSchema>
) => {
  const transaction = await sequelize.transaction();

  try {
    const existingFreezoneItem = await FreezoneItem.findByPk(data.id, {});

    if (!existingFreezoneItem) {
      await transaction.rollback();
      return {
        exists: false,
        freezoneItem: existingFreezoneItem,
      };
    }

    const updatedFreezoneItem = await existingFreezoneItem.update(
      {
        status: data.status,
      },
      { transaction }
    );

    await transaction.commit();

    return {
      exists: true,
      freezoneItem: updatedFreezoneItem,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const freezoneServices = {
  addFreezoneItem,
  getFreezoneItem,
  getFreezoneItems,
  updateFreezoneItem,
  updateFreezoneItemOnOrderUpdate,
  updateFreezoneItemStatus,
  deleteFreezoneItem,
};
