import { sendResponse } from '@helpers';
import { distributionServices } from '@services';
import { distributionItemSchema } from '@validations';
import { Request, Response } from 'express';

const getDistributionItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const distributionItem = await distributionServices.getDistributionItem(req, res, Number(id));

    return sendResponse(res, 200, 'დისტრიბუცია წარმატებით მოიძებნა!', distributionItem);
  } catch (error) {
    console.error('Error fetching an order', error);
    return sendResponse(res, 500, 'შეცდომა დისტრიბუციის ძებნისას', error);
  }
};

const getDistributionItems = async (req: Request, res: Response) => {
  try {
    const distributionItem = await distributionServices.getDistributionItems(req, res);

    if (!distributionItem.exists) return sendResponse(res, 404, 'მსგავსი დისტრიბუცია ვერ მოიძებნა', distributionItem.data);

    return sendResponse(res, 200, 'დისტრიბუციები წარმატებით მოიძებნა!', distributionItem.data);
  } catch (error) {
    console.error('Error fetching an order', error);
    return sendResponse(res, 500, 'შეცდომა დისტრიბუციის ძებნისას', error);
  }
};

const updateDistributionItem = async (req: Request, res: Response) => {
  const data = req.body;

  const parsedData = distributionItemSchema.safeParse(data);

  if (!parsedData.success) return sendResponse(res, 400, 'Validation error', parsedData.error.format());

  try {
    const updatedOrder = await distributionServices.updateDistributionItem(req, res, parsedData.data);

    if (!updatedOrder.exists) return sendResponse(res, 404, 'შეკვეთა ვერ მოიძებნა', updatedOrder.data);

    return sendResponse(res, 200, 'შეკვეთა წარმატებით განახლდა', updatedOrder.data);
  } catch (error) {
    console.error('Error updating an order:', error);
    return sendResponse(res, 500, 'შეცდომა შეკვეთის განახლებისას', error);
  }
};

export const distributionController = {
  getDistributionItem,
  getDistributionItems,
  updateDistributionItem,
};
