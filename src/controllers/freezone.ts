import { sendResponse } from '@/helpers';
import { freezoneServices } from '@/services';
import { freezoneItemSchema } from '@/validations';
import { Request, Response } from 'express';

const getFreezoneItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const freezoneItem = await freezoneServices.getFreezoneItem(req, res, Number(id));

    return sendResponse(res, 200, 'შეკვეთა თავისუფალ ზონაში წარმატებით მოიძებნა!', freezoneItem);
  } catch (error) {
    console.error('Error fetching an order', error);
    return sendResponse(res, 500, 'შეცდომა შეკვეთის ძებნისას', error);
  }
};

const getFreezoneItems = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const freezoneItems = await freezoneServices.getFreezoneItems(req, res, Number(id));

    if (!freezoneItems.exists)
      return sendResponse(res, 404, 'შეკვეთები თავისუფალ ზონაში ვერ მოიძებნა', freezoneItems.freezoneItems);

    return sendResponse(res, 200, 'შეკვეთები თავისუფალ ზონაში წარმატებით მოიძებნა!', freezoneItems.freezoneItems);
  } catch (error) {
    console.error('Error fetching an order', error);
    return sendResponse(res, 500, 'შეცდომა შეკვეთების ძებნისას', error);
  }
};

const updateFreezoneItem = async (req: Request, res: Response) => {
  const data = req.body;

  const parsedData = freezoneItemSchema.safeParse(data);

  if (!parsedData.success) return sendResponse(res, 400, 'Validation error', parsedData.error.format());

  try {
    const updatedOrder = await freezoneServices.updateFreezoneItem(req, res, parsedData.data);

    if (!updatedOrder.exists) return sendResponse(res, 404, 'შეკვეთა ვერ მოიძებნა', updatedOrder.freezoneItem);

    return sendResponse(res, 200, 'შეკვეთა წარმატებით განახლდა', updatedOrder.freezoneItem);
  } catch (error) {
    console.error('Error updating an order:', error);
    return sendResponse(res, 500, 'შეცდომა შეკვეთის განახლებისას', error);
  }
};

export const freezoneController = {
  getFreezoneItem,
  getFreezoneItems,
  updateFreezoneItem,
};
