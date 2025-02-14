import { Request, Response } from "express";

import { token } from "@/helpers";

import { authServices } from "@/services";
import { JwtPayload } from "jsonwebtoken";

const login = async (req: Request, res: Response) => {
  const data = req.body;

  const result = await authServices.login(res, data);

  res.status(result.status).json({
    message: result.message,
    data: result.data,
  });
};

const register = async (req: Request, res: Response) => {
  const data = req.body;
  const result = await authServices.register(data);

  res.status(result.status).json({
    message: result.message,
    data: result.data,
  });
};

const me = async (req: Request, res: Response) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) return;

  const verifiedToken = token.verify(accessToken);

  if (verifiedToken) {
    const { id } = verifiedToken as JwtPayload;
    const result = await authServices.me(id);

    res.status(result.status).json({
      message: result.message,
      data: result.data,
    });
  } else {
    res.status(401).json({
      message: "Unauthorized",
      data: null,
    });
  }
};

const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    if (!refreshToken) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
  } catch (error) {}
};

export const authController = {
  login,
  register,
  me,
};
