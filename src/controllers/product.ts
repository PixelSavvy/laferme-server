import { sendResponse } from "@/helpers";
import { productServices } from "@/services";
import { newProductSchema, productSchema } from "@/validators";
import { Request, Response } from "express";

const getProducts = async (req: Request, res: Response) => {
  try {
    const foundProducts = await productServices.getProducts(req, res);

    if (!foundProducts.length)
      return sendResponse(res, 200, "პროდუქტები ვერ მოიძებნა", []);

    return sendResponse(
      res,
      200,
      "პროდუქტები წარმატებით მოიძებნა",
      foundProducts
    );
  } catch (error) {
    console.error(error);
    return sendResponse(res, 505, "შეცდომა პროდუქტების ძებნისას", error);
  }
};

const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  console.log(id);
  try {
    const foundProduct = await productServices.getProduct(req, res, id);

    if (!foundProduct)
      return sendResponse(res, 404, "პროდუქტი ვერ მოიძებნა", {});

    return sendResponse(res, 200, "პროდუქტი წარმატებით მოიძებნა", foundProduct);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 505, "შეცდომა პროდუქტის ძებნისას", error);
  }
};

const addProduct = async (req: Request, res: Response) => {
  // Extract data from the server
  const data = req.body;

  // Parse data
  const parsedData = newProductSchema.safeParse(data);

  // If the data does not match the schema, return server error to the clinet
  if (!parsedData.success)
    return sendResponse(
      res,
      400,
      "Validation error",
      parsedData.error.format()
    );

  // If the data parsed successfully, follow the addProduct service
  try {
    // Add a new product
    const result = await productServices.addProduct(req, res, parsedData.data);

    // If the product was not added (wrong input)
    if (result.exists)
      return sendResponse(
        res,
        409,
        "პროდუქტი მსგავსი პროდუქტის კოდით არსებობს"
      );

    // If product added successfully
    return sendResponse(
      res,
      201,
      "პროდუქტი წარმატებით დაემატა",
      result.product
    );
  } catch (error) {
    console.error("Error adding a product:", error);
    return sendResponse(res, 500, "შეცდომა პროდუქტის შექმნისას", error);
  }
};

const updateProduct = async (req: Request, res: Response) => {
  const data = req.body;

  const parsedData = productSchema.safeParse(data);

  if (!parsedData.success)
    return sendResponse(
      res,
      400,
      "Validation error",
      parsedData.error.format()
    );

  try {
    const updatedProduct = await productServices.updateProduct(
      req,
      res,
      parsedData.data
    );

    if (!updatedProduct.exists)
      return sendResponse(
        res,
        404,
        "პროდუქტი მსგავსი საიდენტიფიკაციო კოდით ვერ მოიძებნა",
        updatedProduct.product
      );

    return sendResponse(
      res,
      200,
      "პროდუქტი წარმატებით განახლდა",
      updatedProduct
    );
  } catch (error) {
    console.error(error);
    return sendResponse(res, 505, "შეცდომა პროდუქტის რედაქტირებისას", error);
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await productServices.deleteProduct(req, res, id);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 505, "შეცდომა პროდუქტის წაშლისას", error);
  }
};

export const productController = {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  getProduct,
};
