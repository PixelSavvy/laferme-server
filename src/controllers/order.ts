import { Request, Response } from "express";

import { orderService } from "@/services";

const addOne = async (req: Request, res: Response) => {
  const data = req.body;

  const result = await orderService.addOne(data);

  res.status(result.status).json({
    message: result.message,
    data: result.data,
  });
};

const getOne = async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await orderService.getOne(id);

  res.status(result.status).json({
    message: result.message,
    data: result.data,
  });
};

const getAll = async (req: Request, res: Response) => {
  const result = await orderService.getAll();

  res.status(result.status).json({
    message: result.message,
    data: result.data,
  });
};

const deleteOne = async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await orderService.deleteOne(id);

  res.status(result.status).json({
    message: result.message,
    data: result.data,
  });
};

const updateOne = async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await orderService.updateOne(id, data);

  res.status(result.status).json({
    message: result.message,
    data: result.data,
  });
};

export const orderController = {
  addOne,
  getOne,
  getAll,
  deleteOne,
  updateOne,
};
