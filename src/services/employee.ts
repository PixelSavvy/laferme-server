import { statusCodes } from "@/config";
import { hashPassword } from "@/helpers";
import { sequelize } from "@/lib";
import { Employee } from "@/models";
import { employeeSchema } from "@/validators";
import { z } from "zod";

const getOne = async (id: string) => {
  const transaction = await sequelize.transaction();

  try {
    const employee = await Employee.findByPk(id, { transaction });

    if (!employee) {
      await transaction.rollback();
      return {
        status: statusCodes.OK,
        message: "თანამშრომელი ვერ მოიძებნა",
        data: null,
      };
    }

    const { password, ...employeeWithoutPassword } = employee.get();

    await transaction.commit();

    return {
      status: statusCodes.OK,
      message: "თანამშრომელი მოიძებნა",
      data: employeeWithoutPassword,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getAll = async () => {
  const transaction = await sequelize.transaction();

  try {
    const employees = await Employee.findAll({ transaction });

    const employeesWithoutPassword = employees.map((employee) => {
      const { password, ...employeeWithoutPassword } = employee.get();
      return employeeWithoutPassword;
    });

    await transaction.commit();

    return {
      status: statusCodes.OK,
      message: "თანამშრომლები მოიძებნა",
      data: employeesWithoutPassword,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const addOne = async (data: z.infer<typeof employeeSchema>) => {
  const transaction = await sequelize.transaction();

  try {
    const employee = await Employee.findOne({
      where: {
        email: data.email,
      },
      transaction,
    });

    if (employee) {
      await transaction.rollback();
      return {
        status: statusCodes.CONFLICT,
        message: "თანამშრომელი მსგავსი ელფოსტით უკვე არსებოს",
        data: employee,
      };
    }

    const hashedPassword = await hashPassword(data.password);

    const newEmployee = await Employee.create(
      {
        ...data,
        password: hashedPassword,
      },
      { transaction }
    );

    const { password, ...employeeWithoutPassword } = newEmployee.get();

    await transaction.commit();

    return {
      status: statusCodes.CREATED,
      message: "თანამშრომელი წარმატებით დაემატა",
      data: employeeWithoutPassword,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const employeeServices = {
  getOne,
  addOne,
  getAll,
};
