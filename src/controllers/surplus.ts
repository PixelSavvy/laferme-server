import { surplusServices } from "@/services";
import { Request, Response } from "express";

const addOne = async (req: Request, res: Response) => {
  const data = req.body;

  const result = await surplusServices.addOne(data);

  res.status(result.status).json({
    message: result.message,
    data: result.data,
  });
};

const getAll = async (req: Request, res: Response) => {
  const result = await surplusServices.getAll();

  res.status(result.status).json({
    message: result.message,
    data: result.data,
  });
};

export const surplusController = {
  addOne,
  getAll,
};
