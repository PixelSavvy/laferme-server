import { distributionStatus } from "@config";
import { sendResponse } from "@helpers";
import { sequelize } from "@lib";
import {
  Customer,
  DistributionItem,
  DistributionItemProduct,
  FreezoneItem,
  FreezoneItemProduct,
  Order,
  Product,
} from "@models";
import { distributionItemSchema } from "@validations";
import { Request, Response } from "express";
import { Op } from "sequelize";
import { z } from "zod";

const addDistributionItem = async (
  req: Request,
  res: Response,
  freezoneItemId: number,
) => {
  const transaction = await sequelize.transaction();

  try {
    const newDistributionItem = await DistributionItem.create(
      {
        freezoneItemId,
        status: distributionStatus[3000],
      },
      { transaction },
    );

    // Fetch associated freezone products
    const freezoneItemProducts = await FreezoneItemProduct.findAll({
      where: {
        freezoneItemId,
      },
      raw: true,
    });

    const transformedDistributionItemProducts = freezoneItemProducts.map(
      (product) => ({
        ...product,
        distributionItemId: newDistributionItem.id,
        distributedWeight: 0,
      }),
    );

    const distributionItemProducts = await DistributionItemProduct.bulkCreate(
      transformedDistributionItemProducts,
      {
        transaction,
      },
    );

    if (distributionItemProducts.length === 0) return;

    await transaction.commit();

    return newDistributionItem;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getDistributionItem = async (req: Request, res: Response, id: number) => {
  try {
    const distributionItem = await DistributionItem.findByPk(id, {
      attributes: {
        exclude: ["freezoneItemId"],
      },
      include: [
        {
          model: FreezoneItem,
          as: "freezone",
        },

        {
          model: Product,
          as: "products",
          attributes: ["id", "title", "productCode"],
          through: {
            as: "details",
            attributes: [
              "adjustedWeight",
              "adjustedQuantity",
              "distributedWeight",
            ],
          },
        },
      ],
    });

    if (!distributionItem)
      return sendResponse(res, 404, "მსგავსი დისტრიბუცია ვერ მოიძებნა");

    return distributionItem;
  } catch (error) {
    throw error;
  }
};

const getDistributionItems = async (req: Request, res: Response) => {
  try {
    const existingDistributionItems = await DistributionItem.findAll({
      include: [
        {
          model: FreezoneItem,
          as: "freezone",
          attributes: ["orderId"],
        },
        {
          model: Product,
          as: "products",
          attributes: ["id", "title", "productCode"],
          through: {
            as: "distributionDetails",
            attributes: ["adjustedWeight", "distributedWeight", "price"],
          },
        },
      ],
    });

    if (existingDistributionItems.length === 0)
      return {
        exists: false,
        data: existingDistributionItems,
      };

    const orderIds = existingDistributionItems.map(
      (item) => item.freezone!.orderId,
    );

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

    const transformedDistributionItems = existingDistributionItems.map(
      (item) => {
        const order = customers.find(
          (customer) => customer.id === item.freezone?.orderId,
        );

        return {
          ...item.toJSON(),
          customer: order?.customer,
        };
      },
    );

    return {
      exists: true,
      data: transformedDistributionItems,
    };
  } catch (error) {
    throw error;
  }
};

const updateDistributionItem = async (
  req: Request,
  res: Response,
  data: z.infer<typeof distributionItemSchema>,
) => {
  const transaction = await sequelize.transaction();

  try {
    const existingDistributionItem = await DistributionItem.findByPk(data.id, {
      transaction,
    });

    if (!existingDistributionItem) {
      await transaction.rollback();
      return {
        exists: false,
        data: existingDistributionItem,
      };
    }

    const { products, ...distributionItemData } = data;
    // Update the order
    const updatedDistributionItem = await existingDistributionItem.update(
      distributionItemData,
      { transaction },
    );

    // Rebuild the `FreezoneItemProduct` associations
    const distributionItemProducts = data.products.map((product) => ({
      distributionItemId: updatedDistributionItem.id,
      productId: product.productId,
      price: product.price,
      adjustedWeight: product.adjustedWeight,
      distributedWeight: product.distributedWeight,
    }));

    // Replace existing associations with the new ones
    await DistributionItemProduct.destroy({
      where: { distributionItemId: updatedDistributionItem.id },
      transaction,
    });

    await DistributionItemProduct.bulkCreate(distributionItemProducts, {
      transaction,
    });

    // Commit the transaction
    await transaction.commit();

    return {
      exists: true,
      order: updatedDistributionItem,
    };
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating distribution item:", error);
    throw error;
  }
};

export const distributionServices = {
  addDistributionItem,
  getDistributionItem,
  getDistributionItems,
  updateDistributionItem,
};
