import { z } from "zod";

import { statusCodes } from "@/config";
import { sequelize } from "@/lib";
import { Product } from "@/models";
import { productSchema } from "@/validators";

const addOne = async (data: z.infer<typeof productSchema>) => {
  const transaction = await sequelize.transaction();

  try {
    const existingProduct = await Product.findOne({
      where: {
        productCode: data.productCode,
      },
      transaction,
    });

    if (existingProduct) {
      await transaction.rollback();
      return {
        status: statusCodes.CONFLICT,
        message: "პროდუქტი მსგავსი პროდუქტის კოდით უკვე არსებობს",
        data: existingProduct,
      };
    }

    const newProduct = await Product.create(data, { transaction });

    await transaction.commit();

    return {
      status: statusCodes.CREATED,
      message: "პროდუქტი წარმატებით დაემატა",
      data: newProduct,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getOne = async (id: string) => {
  const transaction = await sequelize.transaction();

  try {
    const product = await Product.findByPk(id, { transaction });

    if (!product) {
      await transaction.rollback();
      return {
        status: statusCodes.OK,
        message: "პროდუქტი მსგავსი საიდენტიფიკაციო კოდით ვერ მოიძებნა",
        data: null,
      };
    }

    await transaction.commit();
    return {
      status: statusCodes.OK,
      message: "პროდუქტი წარმატებით მოიძებნა",
      data: product,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getAll = async () => {
  const transaction = await sequelize.transaction();

  try {
    const products = await Product.findAll({ transaction });

    if (!products.length)
      return {
        status: statusCodes.OK,
        message: "პროდუქტები ვერ მოიძებნა",
        data: [],
      };

    await transaction.commit();
    return {
      status: statusCodes.OK,
      message: "პროდუქტები წარმატებით მოიძებნა",
      data: products,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const deleteOne = async (id: string) => {
  const transaction = await sequelize.transaction();

  try {
    const product = await Product.findByPk(id, { transaction });

    if (!product) {
      await transaction.rollback();
      return {
        status: statusCodes.OK,
        message: "პროდუქტი მსგავსი საიდენტიფიკაციო კოდით ვერ მოიძებნა",
        data: null,
      };
    }

    await product.destroy({ transaction });

    await transaction.commit();
    return {
      status: statusCodes.OK,
      message: "პროდუქტი წაიშალა",
      data: product,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateOne = async (id: string, data: z.infer<typeof productSchema>) => {
  const transaction = await sequelize.transaction();

  try {
    const product = await Product.findByPk(id, { transaction });

    if (!product) {
      await transaction.rollback();
      return {
        status: statusCodes.OK,
        message: "პროდუქტი მსგავსი საიდენტიფიკაციო კოდით ვერ მოიძებნა",
        data: null,
      };
    }

    const updatedProduct = await product.update(data, { transaction });

    await transaction.commit();

    return {
      status: statusCodes.OK,
      message: "პროდუქტი წარმატებით განახლდა",
      data: updatedProduct,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const productService = {
  addOne,
  getOne,
  getAll,
  deleteOne,
  updateOne,
};
