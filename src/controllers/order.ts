import { statuses } from "@/config";
import { sendResponse } from "@/helpers";
import { sequelize } from "@/lib";
import { distributionServices, freezoneServices, orderServices } from "@/services";
import { newOrderSchema, updateOrderSchema } from "@/validators";
import { NextFunction, Request, Response } from "express";

const addOrder = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  const data = req.body;

  const parsedData = newOrderSchema.safeParse(data);

  if (!parsedData.success) return sendResponse(res, 400, "Validation error", parsedData.error.format());

  try {
    const orderId = await orderServices.addOrder(req, res, parsedData.data);

    if (!orderId) {
      await transaction.rollback();
      return sendResponse(res, 500, "შეცდომა შეკვეთის შექმნისას");
    }

    const freezoneItemId = await freezoneServices.addFreezoneItem(req, res, orderId);

    if (!freezoneItemId) {
      await transaction.rollback();
      return sendResponse(res, 500, "შეცდომა შეკვეთის თავისუფალ ზონაში დამატებისას");
    }

    await transaction.commit();

    return sendResponse(res, 201, `შეკვეთა წარმატებით დაემატა`);
  } catch (error) {
    await transaction.rollback();
    console.error("Error adding an order:", error);
    return sendResponse(res, 500, "შეცდომა შეკვეთის შექმნისას", error);
  }
};

const getOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const order = await orderServices.getOrder(req, res, Number(id));

    if (!order.exists) return sendResponse(res, 202, "შეკვეთა ვერ მოიძებნა", order.order);

    return sendResponse(res, 201, "შეკვეთა წარმატებით მოიძებნა!", order.order);
  } catch (error) {
    console.error("Error fetching an order", error);
    return sendResponse(res, 500, "შეცდომა შეკვეთის ძებნისას", error);
  }
};

const getOrders = async (req: Request, res: Response) => {
  try {
    const foundOrders = await orderServices.getOrders(req, res);

    if (!foundOrders.exists) return sendResponse(res, 202, "შეკვეთები ვერ მოიძებნა", foundOrders.orders);

    return sendResponse(res, 200, "შეკვეთები წარმატებით მოიძებნა", foundOrders.orders);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, "შეცდომა შეკვეთების ძებნისას", error);
  }
};

const deleteOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await orderServices.deleteOrder(req, res, Number(id));
  } catch (error) {
    console.error("Error deleting an order:", error);
    return sendResponse(res, 500, "შეცდომა შეკვეთის წაშლისას", error);
  }
};

const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  const transaction = await sequelize.transaction();

  const parsedData = updateOrderSchema.safeParse(data);

  if (!parsedData.success) return sendResponse(res, 400, "Validation error", parsedData.error.format());

  try {
    const updatedOrder = await orderServices.updateOrder(req, res, parsedData.data);

    if (!updatedOrder.exists) {
      await transaction.rollback();
      return sendResponse(res, 404, "შეკვეთა ვერ მოიძებნა", updatedOrder.order);
    }

    // Update freezone item if status === ACCEPTED
    if (parsedData.data.status === statuses.freezone.ACCEPTED) {
      const updatedFreezoneItem = await freezoneServices.updateFreezoneItemOnOrderUpdate(req, res, parsedData.data);

      if (updatedFreezoneItem.exists) {
        await transaction.rollback();
        return next();
      }
    }

    // Create a new distribution item if status === READYTODELIVER
    if (parsedData.data.status === statuses.order.READYTODELIVER) {
      const distributionItemId = await distributionServices.addDistributionItem(req, res, parsedData.data.id);

      if (distributionItemId?.exists) {
        await transaction.rollback();
        return next();
      }
    }

    // Update distribution item if status === CANCELLED or RETURNED
    if (parsedData.data.status === statuses.order.CANCELLED || parsedData.data.status === statuses.order.RETURNED) {
      console.log(true);
      await distributionServices.updateDistributionItemStatus(req, res, parsedData.data.id, parsedData.data.status);
    }

    await transaction.commit();

    return sendResponse(res, 200, "შეკვეთა წარმატებით განახლდა");
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating an order:", error);
    return sendResponse(res, 500, "შეცდომა შეკვეთის განახლებისას", error);
  }
};

export const orderController = {
  addOrder,
  getOrder,
  getOrders,
  deleteOrder,
  updateOrder,
};
