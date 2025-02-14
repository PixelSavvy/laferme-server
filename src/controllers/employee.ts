import { employeeServices } from "@/services";
import { Request, Response } from "express";

const getOne = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await employeeServices.getOne(id);

  res.status(result.status).json({
    message: result.message,
    data: result.data,
  });
};

const getAll = async (req: Request, res: Response) => {
  const result = await employeeServices.getAll();

  res.status(result.status).json({
    message: result.message,
    data: result.data,
  });
};

const addOne = async (req: Request, res: Response) => {
  const data = req.body;

  const result = await employeeServices.addOne(data);

  res.status(result.status).json({
    message: result.message,
    data: result.data,
  });
};

export const employeeController = {
  getOne,
  addOne,
  getAll,
};
