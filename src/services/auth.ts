import { Response } from "express";

import { statusCodes } from "@/config";
import { comparePassword, hashPassword, token } from "@/helpers";
import { sequelize } from "@/lib";
import { Employee } from "@/models";
import { loginSchema, registerSchema } from "@/validators";

import { z } from "zod";

const login = async (res: Response, data: z.infer<typeof loginSchema>) => {
  const transaction = await sequelize.transaction();

  try {
    const employee = await Employee.findOne({
      where: {
        email: data.email,
      },
      transaction,
    });

    // If employee is not found
    if (!employee) {
      await transaction.rollback();
      return {
        status: statusCodes.NOT_FOUND,
        message: "თანამშრომელი ვერ მოიძებნა",
        data: {},
      };
    }

    const { password, ...employeeWithoutPassword } = employee.toJSON();

    const isPasswordValid = await comparePassword(data.password, password);

    // If password is not valid
    if (!isPasswordValid) {
      await transaction.rollback();
      return {
        status: statusCodes.UNAUTHORIZED,
        message: "არასწორი პაროლი",
        data: {},
      };
    }

    // If everything is correct

    // Generate an access token
    const accessToken = token.generate(
      { id: employee.id, email: employee.email },
      {
        expiresIn: "7d", // 7 days
      }
    );

    // Generate a refresh token
    const refreshToken = token.generate(
      { id: employee.id, email: employee.email },
      {
        expiresIn: "7d", // 7 days
      }
    );

    // Set the cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    await transaction.commit();

    return {
      status: statusCodes.OK,
      message: "წარმატებული ავტორიზაცია",
      data: employeeWithoutPassword,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const register = async (data: z.infer<typeof registerSchema>) => {
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
        message: "თანამშრომელი მსგავსი ელფოსტით უკვე არსებობს",
        data: employee,
      };
    }

    const hashedPassword = await hashPassword(data.password);

    if (!hashedPassword) {
      await transaction.rollback();
      return {
        status: statusCodes.INTERNAL_SERVER_ERROR,
        message: "შეცდომა პაროლის დაშიფრვისას",
        data: {},
      };
    }

    const newEmployee = await Employee.create(
      {
        ...data,
        password: hashedPassword,
      },
      { transaction }
    );

    const { password, ...employeeWithoutPassword } = newEmployee.toJSON();

    await transaction.commit();

    return {
      status: statusCodes.CREATED,
      message: "თანამშრომელი წარმატებით შეიქმნა",
      data: employeeWithoutPassword,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Used for useEmployees hook on the frontend
const me = async (id: string) => {
  const transaction = await sequelize.transaction();

  try {
    const employee = await Employee.findByPk(id, { transaction });

    if (!employee) {
      await transaction.rollback();
      return {
        status: statusCodes.NOT_FOUND,
        message: "თანამშრომელი ვერ მოიძებნა",
        data: {},
      };
    }

    await transaction.commit();
    return {
      status: statusCodes.OK,
      message: "თანამშრომელი მოიძებნა",
      data: employee,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const refresh = async (res: Response, refreshToken: string) => {};

export const authServices = {
  login,
  register,
  me,
};
