import { sendResponse } from "@/helpers";
import { customerServices } from "@/services";
import { customerSchema, newCustomerSchema } from "@/validators";
import { Request, Response } from "express";

const getCustomers = async (req: Request, res: Response) => {
  try {
    const foundProducts = await customerServices.getCustomers(req, res);

    if (!foundProducts.length) return sendResponse(res, 200, "სარეალიზაციო პუნქტები ვერ მოიძებნა", []);

    return sendResponse(res, 200, "სარეალიზაციო პუნქტი წარმატებით მოიძებნა", foundProducts);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 505, "შეცდომა სარეალიზაციო პუნქტების ძებნისას", error);
  }
};

const getCustomer = async (req: Request, res: Response) => {
  try {
    const foundProducts = await customerServices.getCustomer(req, res);

    if (!foundProducts.length) return sendResponse(res, 200, "სარეალიზაციო პუნქტი ვერ მოიძებნა", []);

    return sendResponse(res, 200, "სარეალიზაციო პუნქტი წარმატებით მოიძებნა", foundProducts);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 505, "შეცდომა სარეალიზაციო პუნქტის ძებნისას", error);
  }
};

const addCustomer = async (req: Request, res: Response) => {
  const data = req.body;

  const parsedData = newCustomerSchema.safeParse(data);

  if (!parsedData.success) return sendResponse(res, 400, "Validation error", parsedData.error.format());

  try {
    const newCustomer = await customerServices.addCustomer(req, res, parsedData.data);

    // wrong input
    if (newCustomer.exists)
      return sendResponse(res, 400, "სარეალიზაციო პუნქტი მსგავსი ელ.ფოსტით უკვე არსებობს", newCustomer.customer);

    return sendResponse(res, 201, "სარეალიზაციო პუნქტი წარმატებით დაემატა", newCustomer);
  } catch (error) {
    console.error("Error adding a customer:", error);
    return sendResponse(res, 500, "შეცდომა სარეალიზაციო პუნქტის შექმნისას", error);
  }
};

const updateCustomer = async (req: Request, res: Response) => {
  const data = req.body;

  const parsedData = customerSchema.safeParse(data);

  if (!parsedData.success) return sendResponse(res, 400, "Validation error", parsedData.error.format());

  try {
    const updatedCustomer = await customerServices.updateCustomer(parsedData.data);

    if (!updatedCustomer.exists)
      return sendResponse(
        res,
        404,
        "სარეალიზაციო პუნქტი მსგავსი საიდენტიფიკაციო კოდით ვერ მოიძებნა",
        updatedCustomer.customer
      );

    return sendResponse(res, 200, "სარეალიზაციო პუნქტი წარმატებით განახლდა", updatedCustomer);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 505, "შეცდომა სარეალიზაციო პუნქტის რედაქტირებისას", error);
  }
};

const deleteCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await customerServices.deleteCustomer(req, res, id);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 505, "შეცდომა სარეალიზაციო პუნქტის წაშლისას", error);
  }
};

export const customerController = {
  addCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomer,
};
