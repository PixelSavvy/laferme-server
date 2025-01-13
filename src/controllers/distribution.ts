import { sendResponse } from "@/helpers";
import { sequelize } from "@/lib";
import { distributionServices } from "@/services";
import { distributionItemSchema } from "@/validators";
import { Request, Response } from "express";

const getDistributionItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();
  try {
    const distributionItem = await distributionServices.getDistributionItem(req, res, Number(id));

    if (!distributionItem) {
      await transaction.rollback();
      return sendResponse(res, 202, "დისტრიბუცია ვერ მოიძებნა", distributionItem);
    }

    await transaction.commit();
    return sendResponse(res, 200, "დისტრიბუცია წარმატებით მოიძებნა!", distributionItem);
  } catch (error) {
    await transaction.rollback();
    console.error("Error fetching an order", error);
    return sendResponse(res, 500, "შეცდომა დისტრიბუციის ძებნისას", error);
  }
};

const getDistributionItems = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  try {
    const distributionItem = await distributionServices.getDistributionItems(req, res);

    if (!distributionItem.exists) {
      await transaction.rollback();
      return sendResponse(res, 202, "შეკვეთები დისტრიბუციაში ვერ მოიძებნა", distributionItem.data);
    }

    await transaction.commit();
    return sendResponse(res, 200, "შეკვეთები დისტრიბუციაში წარმატებით მოიძებნა!", distributionItem.data);
  } catch (error) {
    await transaction.rollback();
    console.error("Error fetching an order", error);
    return sendResponse(res, 500, "შეცდომა დისტრიბუციის ძებნისას", error);
  }
};

const updateDistributionItem = async (req: Request, res: Response) => {
  const data = req.body;
  const transaction = await sequelize.transaction();
  const parsedData = distributionItemSchema.safeParse(data);

  if (!parsedData.success) return sendResponse(res, 400, "Validation error", parsedData.error.format());

  try {
    const updatedOrder = await distributionServices.updateDistributionItem(req, res, parsedData.data);

    if (!updatedOrder.exists) {
      await transaction.rollback();
      return sendResponse(res, 202, "შეკვეთა ვერ მოიძებნა", updatedOrder.data);
    }

    await transaction.commit();
    return sendResponse(res, 200, "შეკვეთა წარმატებით განახლდა", updatedOrder.data);
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating an order:", error);
    return sendResponse(res, 500, "შეცდომა შეკვეთის განახლებისას", error);
  }
};

export const distributionController = {
  getDistributionItem,
  getDistributionItems,
  updateDistributionItem,
};
