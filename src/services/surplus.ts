import { statusCodes } from "@/config";
import { sequelize } from "@/lib";
import { Product, SurplusProduct } from "@/models";
import { Surplus } from "@/models/surplus";
import { surplusSchema } from "@/validators";
import { z } from "zod";

const addOne = async (data: z.infer<typeof surplusSchema>) => {
  const transaction = await sequelize.transaction();
  const { products, ...rest } = data;

  try {
    // Add surplus
    const existingSurplus = await Surplus.findByPk(rest.orderId, { transaction });

    if (existingSurplus) {
      await transaction.rollback();
      return {
        status: statusCodes.BAD_REQUEST,
        message: "ნაშთი ამ შეკვეთისთვის უკვე არსებობს",
        data: existingSurplus,
      };
    }

    const surplus = await Surplus.create(data, { transaction });

    // Add products
    const transformedProducts = products.map((product) => ({
      surplusId: surplus.id,
      productId: product.id,
      weight: product.weight,
      quantity: product.quantity,
      identificator: product.identificator,
    }));

    await SurplusProduct.bulkCreate(transformedProducts, { transaction });

    await transaction.commit();

    return {
      status: statusCodes.CREATED,
      message: "ნაშთი წარმატებით დაემატა",
      data: {
        surplus,
        products: transformedProducts,
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getAll = async () => {
  const transaction = await sequelize.transaction();

  try {
    const surpluses = await Surplus.findAll({
      include: [
        {
          model: Product,
          as: "products",
          attributes: {
            exclude: ["prices", "hasVAT"],
          },
          through: {
            as: "details",
            attributes: {
              exclude: ["surplusId", "productId"],
            },
          },
        },
      ],
      transaction,
    }).catch((error) => console.log(error));

    if (!surpluses)
      return {
        status: statusCodes.OK,
        message: "ნაშთები ვერ მოიძებნა",
        data: null,
      };
    const groupByCondition = surpluses.reduce(
      (acc, surplus) => {
        const { condition, ...rest } = surplus.toJSON();

        if (condition) {
          const lowerCaseCondition = condition.toLowerCase() as keyof typeof acc;
          if (acc[lowerCaseCondition]) {
            acc[lowerCaseCondition] = [...acc[lowerCaseCondition], { ...rest }];
          }
        }

        return acc;
      },
      {
        fresh: [] as any[],
        medium: [] as any[],
        old: [] as any[],
        expired: [] as any[],
      }
    );

    await transaction.commit();

    return {
      status: statusCodes.OK,
      message: "ნაშთები წარმატებით მოიძებნა",
      data: groupByCondition,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const surplusServices = {
  addOne,
  getAll,
};
