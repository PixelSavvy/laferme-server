import { sendResponse } from "@/helpers";
import { sequelize } from "@/lib";
import { freezoneServices, orderServices } from "@/services";
import { updateFreezoneItemSchema } from "@/validators";
import { Request, Response } from "express";

const getFreezoneItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();
  try {
    const freezoneItem = await freezoneServices.getFreezoneItem(req, res, Number(id));

    if (!freezoneItem) {
      await transaction.rollback();
      return sendResponse(res, 202, "შეკვეთა თავისუფალ ზონაში ვერ მოიძებნა", freezoneItem);
    }

    await transaction.commit();
    return sendResponse(res, 200, "შეკვეთა თავისუფალ ზონაში წარმატებით მოიძებნა!", freezoneItem);
  } catch (error) {
    await transaction.rollback();
    console.error("Error fetching an order", error);
    return sendResponse(res, 500, "შეცდომა შეკვეთის ძებნისას", error);
  }
};

const getFreezoneItems = async (req: Request, res: Response) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();
  try {
    const freezoneItems = await freezoneServices.getFreezoneItems(req, res, Number(id));

    if (!freezoneItems.exists) {
      await transaction.rollback();
      return sendResponse(res, 202, "შეკვეთები თავისუფალ ზონაში ვერ მოიძებნა", freezoneItems.freezoneItems);
    }

    await transaction.commit();
    return sendResponse(res, 200, "შეკვეთები თავისუფალ ზონაში წარმატებით მოიძებნა!", freezoneItems.freezoneItems);
  } catch (error) {
    await transaction.rollback();
    console.error("Error fetching an order", error);
    return sendResponse(res, 500, "შეცდომა შეკვეთების ძებნისას", error);
  }
};

const updateFreezoneItem = async (req: Request, res: Response) => {
  const data = req.body;
  const transaction = await sequelize.transaction();

  const parsedData = updateFreezoneItemSchema.safeParse(data);

  if (!parsedData.success) {
    return sendResponse(res, 400, "შეკვეთის განახლების მონაცემები არ არის სწორი", parsedData.error);
  }

  try {
    // Update the freezoneItem
    const updatedFreezoneItem = await freezoneServices.updateFreezoneItem(req, res, parsedData.data);

    if (!updatedFreezoneItem.exists) {
      await transaction.rollback();
      return sendResponse(res, 202, "შეკვეთა ვერ მოიძებნა", updatedFreezoneItem.freezoneItem);
    }

    // Update the associated order status
    const updatedOrder = await orderServices.updateOrderStatus(req, res, parsedData.data.id, parsedData.data.status);

    if (!updatedOrder.exists) {
      await transaction.rollback();
      return sendResponse(res, 202, "შეკვეთა განახლდა, მაგრამ შეკვეთის სტატუსი ვერ განახლდა", updatedOrder.existingOrder);
    }

    await transaction.commit();

    return sendResponse(res, 200, "შეკვეთა წარმატებით განახლდა", updatedFreezoneItem.freezoneItem);
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating an order:", error);
    return sendResponse(res, 500, "შეცდომა შეკვეთის განახლებისას", error);
  }
};

export const freezoneController = {
  getFreezoneItem,
  getFreezoneItems,
  updateFreezoneItem,
};
