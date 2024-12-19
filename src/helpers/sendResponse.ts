import { Response } from "express";

export const sendResponse = <T>(
  res: Response,
  status: number,
  message: string,
  data?: T,
) => {
  // If there is data, send to the client
  if (data !== undefined) {
    return res.status(status).json({
      message,
      data,
    });
  }

  // If there is no data, omit from the client
  return res.status(status).json({ message });
};
