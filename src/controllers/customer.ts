import { Request, Response } from "express";

import { customerService } from "@/services";

const addOne = async (req: Request, res: Response) => {
  const data = req.body;

  const result = await customerService.addOne(data);

  res.status(result.status).json({
    message: result.message,
    data: result.data,
  });
};

const getOne = async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await customerService.getOne(id);

  res.status(result.status).json({
    message: result.message,
    data: result.data,
  });
};

const getAll = async (req: Request, res: Response) => {
  const result = await customerService.getAll();

  res.status(result.status).json({
    message: result.message,
    data: result.data,
  });
};

const deleteOne = async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await customerService.deleteOne(id);

  res.status(result.status).json({
    message: result.message,
    data: result.data,
  });
};

const updateOne = async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await customerService.updateOne(id, data);

  res.status(result.status).json({
    message: result.message,
    data: result.data,
  });
};

export const customerController = {
  addOne,
  getOne,
  getAll,
  deleteOne,
  updateOne,
};
