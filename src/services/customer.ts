import { z } from "zod";

import { statusCodes } from "@/config";
import { sequelize } from "@/lib";
import { Customer, Product } from "@/models";
import { customerSchema } from "@/validators";

const addOne = async (data: z.infer<typeof customerSchema>) => {
  const transaction = await sequelize.transaction();

  try {
    // Check if the customer already exists by id
    const existingCustomer = await Customer.findOne({
      where: {
        email: data.email,
        identificationNumber: data.identificationNumber,
      },
      transaction,
    });

    if (existingCustomer) {
      return {
        status: statusCodes.CONFLICT,
        message: "სარეალიზაციო პუნქტი მსგავსი საიდენტიფიკაციო კოდით ან ელ.ფოსტით უკვე არსებოს",
        data: existingCustomer,
      };
    }

    // Create the new customer
    const newCustomer = await Customer.create(data, { transaction });

    // If no products, simply commit the transaction
    if (!Array.isArray(data.products) || !data.products.length) {
      await transaction.commit();
      return {
        status: statusCodes.OK,
        message: "სარეალიზაცო პუნქტი წარმატებით დაემატა",
        data: newCustomer,
      };
    }

    // Retrieve product instances by their IDs
    const customerProductIds = data.products.map((product) => product.id);
    const products = await Product.findAll({
      where: { id: customerProductIds },
      transaction,
    });

    // If not all products were found, rollback the transaction
    if (products.length !== customerProductIds.length) {
      await transaction.rollback();
      return {
        status: statusCodes.OK,
        message: "პროდუქტები ვერ მოიძებნა",
        data: [],
      };
    }

    // Add products to the customer
    await newCustomer.addProducts(products, { transaction });

    // Commit the transaction after adding products
    await transaction.commit();

    return {
      status: statusCodes.OK,
      message: "სარეალიზაცო პუნქტი წარმატებით დაემატა",
      data: newCustomer,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getOne = async (id: string) => {
  const transaction = await sequelize.transaction();

  try {
    const customer = await Customer.findByPk(id, {
      include: [
        {
          model: Product,
          as: "products",
          through: { attributes: [] },
        },
      ],
      transaction,
    });

    if (!customer) {
      await transaction.rollback();
      return {
        status: statusCodes.OK,
        message: "სარეალიზაციო პუნქტი ვერ მოიძებნა",
        data: {},
      };
    }

    await transaction.commit();

    return {
      status: statusCodes.OK,
      message: "სარეალიზაციო პუნქტი მოიძებნა",
      data: customer,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getAll = async () => {
  const transaction = await sequelize.transaction();

  try {
    const customers = await Customer.findAll({
      include: [
        {
          model: Product,
          as: "products",
          through: { attributes: [] },
        },
      ],
      transaction,
    });

    if (!customers.length) {
      await transaction.rollback();
      return {
        status: statusCodes.OK,
        message: "სარეალიზაციო პუნქტები ვერ მოიძებნა",
        data: [],
      };
    }

    await transaction.commit();

    return {
      status: statusCodes.OK,
      message: "სარეალიზაციო პუნქტები მოიძებნა",
      data: customers,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const deleteOne = async (id: string) => {
  const transaction = await sequelize.transaction();

  try {
    const customer = await Customer.findByPk(id, { transaction });

    if (!customer) {
      await transaction.rollback();
      return {
        status: statusCodes.OK,
        message: "სარეალიზაციო პუნქტი მსგავსი საიდენტიფიკაციო კოდით ვერ მოიძებნა",
        data: {},
      };
    }

    await customer.destroy({ transaction });

    await transaction.commit();

    return {
      status: statusCodes.OK,
      message: "სარეალიზაციო პუნქტი წარმატებით წაიშალა",
      data: customer,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateOne = async (id: string, data: z.infer<typeof customerSchema>) => {
  const transaction = await sequelize.transaction();

  try {
    const customer = await Customer.findByPk(id, { transaction });

    if (!customer) {
      await transaction.rollback();
      return {
        status: statusCodes.OK,
        message: "სარეალიზაციო პუნქტი ვერ მოიძებნა",
        data: {},
      };
    }

    const updatedCustomer = await customer.update(data, { transaction });

    // If no products, simply commit the transaction
    if (!Array.isArray(data.products) || !data.products.length) {
      await updatedCustomer.setProducts([], { transaction });
      await transaction.commit();
      return {
        status: statusCodes.OK,
        message: "სარეალიზაცო პუნქტი წარმატებით განახლდა",
        data: updatedCustomer,
      };
    }

    // Retrieve product instances by their IDs
    const customerProductIds = data.products.map((product) => product.id);

    const products = await Product.findAll({
      where: { id: customerProductIds },
      transaction,
    });

    // If not all products were found, rollback the transaction
    if (products.length !== customerProductIds.length) {
      await transaction.rollback();
      return {
        status: statusCodes.OK,
        message: "პროდუქტები ვერ მოიძებნა",
        data: [],
      };
    }

    // Add products to the customer
    await updatedCustomer.setProducts(products, { transaction });

    // Commit the transaction after adding products
    await transaction.commit();

    return {
      status: statusCodes.OK,
      message: "სარეალიზაცო პუნქტი წარმატებით განახლდა",
      data: updatedCustomer,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const customerService = {
  addOne,
  getOne,
  getAll,
  deleteOne,
  updateOne,
};
