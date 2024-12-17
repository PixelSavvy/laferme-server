import { Request, Response } from 'express';
import { z } from 'zod';

import { sendResponse } from '@/helpers';

import { sequelize } from '@/lib';
import { Product } from '@/models';
import { newProductSchema, productSchema } from '@/validations';

const addProduct = async (req: Request, res: Response, data: z.infer<typeof newProductSchema>) => {
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
        exists: true,
        product: existingProduct,
      };
    }

    const newProduct = await Product.create(data);

    return {
      exists: false,
      product: newProduct,
    };
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
};

const getProducts = async (req: Request, res: Response) => {
  try {
    const foundProduct = await Product.findAll();

    return foundProduct;
  } catch (error) {
    throw error;
  }
};

const getProduct = async (req: Request, res: Response, id: string) => {
  try {
    const foundProduct = await Product.findByPk(id);

    return foundProduct;
  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (req: Request, res: Response, id: string) => {
  const transaction = await sequelize.transaction();
  try {
    const foundProduct = await Product.findByPk(id, { transaction });

    if (!foundProduct) {
      await transaction.rollback();
      return sendResponse(res, 404, 'პროდუქტი მსგავსი საიდენტიფიკაციო კოდით ვერ მოიძებნა!');
    }

    await foundProduct.destroy({ transaction });

    // Verify the product is no longer in the database
    const checkDeleted = await Product.findByPk(id, { transaction });
    if (checkDeleted) {
      await transaction.rollback();
      return sendResponse(res, 500, 'პროდუქტის წაშლა ვერ მოხერხდა!');
    }

    await transaction.commit();
    return sendResponse(res, 200, 'პროდუქტი წარმატებით წაიშალა!');
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateProduct = async (req: Request, res: Response, data: z.infer<typeof productSchema>) => {
  const transaction = await sequelize.transaction();

  try {
    const existingProduct = await Product.findByPk(data.id, {
      transaction,
    });

    if (!existingProduct)
      return {
        exists: false,
        product: existingProduct,
      };

    const updatedProduct = await existingProduct.update(data, {
      transaction,
    });

    await transaction.commit();

    return {
      exists: true,
      product: updatedProduct,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const productServices = {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  getProduct,
};
