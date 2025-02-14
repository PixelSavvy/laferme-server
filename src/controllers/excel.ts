import { Request, Response } from "express";

import { excelServices } from "@/services";

const getProducts = async (req: Request, res: Response) => {
  await excelServices.getProducts(res);
};

const getCustomers = async (req: Request, res: Response) => {
  await excelServices.getCustomers(res);
};

const getOrders = async (req: Request, res: Response) => {
  await excelServices.getOrders(res);
};

const getCleanzoneItems = async (req: Request, res: Response) => {
  await excelServices.getCleanzoneItems(res);
};

const getDistributionItems = async (req: Request, res: Response) => {
  await excelServices.getDistributionItems(res);
};

export const excelControllers = {
  getProducts,
  getCustomers,
  getOrders,
  getCleanzoneItems,
  getDistributionItems,
};
