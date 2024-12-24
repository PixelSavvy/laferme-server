import { sendResponse } from "@/helpers";
import { freezoneServices } from "@/services";
import { updateFreezoneItemSchema } from "@/validators";
import { Request, Response } from "express";

const getFreezoneItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const freezoneItem = await freezoneServices.getFreezoneItem(req, res, Number(id));

    return sendResponse(res, 200, "შეკვეთა თავისუფალ ზონაში წარმატებით მოიძებნა!", freezoneItem);
  } catch (error) {
    console.error("Error fetching an order", error);
    return sendResponse(res, 500, "შეცდომა შეკვეთის ძებნისას", error);
  }
};

const getFreezoneItems = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const freezoneItems = await freezoneServices.getFreezoneItems(req, res, Number(id));

    if (!freezoneItems.exists)
      return sendResponse(res, 202, "შეკვეთები თავისუფალ ზონაში ვერ მოიძებნა", freezoneItems.freezoneItems);

    return sendResponse(res, 200, "შეკვეთები თავისუფალ ზონაში წარმატებით მოიძებნა!", freezoneItems.freezoneItems);
  } catch (error) {
    console.error("Error fetching an order", error);
    return sendResponse(res, 500, "შეცდომა შეკვეთების ძებნისას", error);
  }
};

const updateFreezoneItem = async (req: Request, res: Response) => {
  const data = req.body;

  const parsedData = updateFreezoneItemSchema.safeParse(data);

  if (!parsedData.success) return sendResponse(res, 400, "Validation error", parsedData.error.format());

  try {
    // Update the order in freezone
    const updatedFreezoneItem = await freezoneServices.updateFreezoneItem(req, res, parsedData.data);

    if (!updatedFreezoneItem.exists)
      return sendResponse(res, 202, "შეკვეთა ვერ მოიძებნა", updatedFreezoneItem.freezoneItem);

    // Update the order in distribution

    return sendResponse(res, 200, "შეკვეთა წარმატებით განახლდა", updatedFreezoneItem.freezoneItem);
  } catch (error) {
    console.error("Error updating an order:", error);
    return sendResponse(res, 500, "შეცდომა შეკვეთის განახლებისას", error);
  }
};

export const freezoneController = {
  getFreezoneItem,
  getFreezoneItems,
  updateFreezoneItem,
};
