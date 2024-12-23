import { Request, Response } from "express";
import { z } from "zod";

import { Customer, Product, ProductInstance } from "@/models";
import { customerSchema, newCustomerSchema } from "@/validators";

import { sendResponse } from "@/helpers";
import { sequelize } from "@/lib";
import { Op } from "sequelize";

const addCustomer = async (
  req: Request,
  res: Response,
  data: z.infer<typeof newCustomerSchema>
) => {
  const transaction = await sequelize.transaction();
  try {
    // Check if the customer with the same email already exists
    const existingCustomer = await Customer.findOne({
      where: {
        email: data.email,
      },
      transaction,
    });

    if (existingCustomer) {
      await transaction.rollback();
      return {
        success: true,
        customer: existingCustomer,
      };
    }

    // If the products array is not empty, check if the products exist
    let existingProducts: ProductInstance[] = [];

    if (data.products && data.products.length > 0) {
      const productIds = data.products.map((product) => product.id);
      existingProducts = await Product.findAll({
        where: {
          id: {
            [Op.in]: productIds,
          },
        },
        transaction,
      });
    }

    // If the customer with the same email does not exist and the products exist
    const newCustomer = await Customer.create(data);

    // Associate customer products with the newly create customer
    await newCustomer.setProducts(existingProducts);

    await transaction.commit();

    return {
      exists: false,
      customer: newCustomer,
    };
  } catch (error) {
    await transaction.rollback();
    console.log("Failed to add a customer", error);
    throw new Error("Failed to create customer");
  }
};

const getCustomers = async (req: Request, res: Response) => {
  try {
    const foundCustomer = await Customer.findAll({
      include: [
        {
          model: Product,
          as: "products",
          through: {
            attributes: [],
          },
        },
      ],
      nest: true,
    });

    return foundCustomer;
  } catch (error) {
    throw error;
  }
};

const getCustomer = async (req: Request, res: Response) => {
  try {
    const foundCustomer = await Customer.findAll({
      include: [
        {
          model: Product,
          as: "products",
          through: {
            attributes: [],
          },
        },
      ],
      nest: true,
    });

    return foundCustomer;
  } catch (error) {
    throw error;
  }
};

const updateCustomer = async (data: z.infer<typeof customerSchema>) => {
  const transaction = await sequelize.transaction();

  try {
    const existingCustomer = await Customer.findByPk(data.id, { transaction });

    if (!existingCustomer) {
      await transaction.rollback();
      return { exists: false, customer: null };
    }

    const updatedCustomer = await existingCustomer.update(data, {
      transaction,
    });

    let existingProducts: ProductInstance[] = [];

    if (data.products && data.products.length > 0) {
      const productIds = data.products.map((product) => product.id);
      existingProducts = await Product.findAll({
        where: { id: { [Op.in]: productIds } },
        transaction,
      });

      if (existingProducts.length !== data.products.length) {
        await transaction.rollback();
        return { exists: false, customer: null };
      }
    }

    // Associate customer products with the newly updated customer
    await updatedCustomer.setProducts(existingProducts);

    await transaction.commit();

    return { exists: true, customer: updatedCustomer };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const deleteCustomer = async (req: Request, res: Response, id: string) => {
  const transaction = await sequelize.transaction();
  try {
    const foundCustomer = await Customer.findByPk(id, { transaction });

    if (!foundCustomer) {
      await transaction.rollback();
      return sendResponse(
        res,
        404,
        "სარეალიზაციო პუნქტი მსგავსი საიდენტიფიკაციო კოდით ვერ მოიძებნა!"
      );
    }

    await foundCustomer.destroy({ transaction });

    // Verify the customer is no longer in the database
    const checkDeleted = await Customer.findByPk(id, { transaction });
    if (checkDeleted) {
      await transaction.rollback();
      return sendResponse(res, 500, "სარეალიზაციო პუნქტის წაშლა ვერ მოხერხდა!");
    }

    await transaction.commit();
    return sendResponse(res, 200, "სარეალიზაციო პუნქტი წარმატებით წაიშალა!");
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const customerServices = {
  addCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomer,
};
