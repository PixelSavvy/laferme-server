import { Request, Response } from "express";

import { productService } from "@/services";

const addOne = async (req: Request, res: Response) => {
  const data = req.body;

  const result = await productService.addOne(data);

  res.status(result.status).json({
    message: result.message,
    data: result.data,
  });
};

const getOne = async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await productService.getOne(id);

  res.status(result.status).json({
    message: result.message,
    data: result.data,
  });
};

const getAll = async (req: Request, res: Response) => {
  const result = await productService.getAll();

  res.status(result.status).json({
    message: result.message,
    data: result.data,
  });
};

const deleteOne = async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await productService.deleteOne(id);

  res.status(result.status).json({
    message: result.message,
    data: result.data,
  });
};

const updateOne = async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await productService.updateOne(id, data);

  res.status(result.status).json({
    message: result.message,
    data: result.data,
  });
};

export const productController = {
  addOne,
  getOne,
  getAll,
  deleteOne,
  updateOne,
};
