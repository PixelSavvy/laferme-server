import { CookieOptions, Request, Response } from "express";

const set = <T>(res: Response, name: string, value: T, options: CookieOptions = {}) => {
  res.cookie(name, value, {
    ...options,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
};

const get = <T>(req: Request, name: string): T | undefined => {
  const value = req.cookies[name];
  return value ? JSON.parse(value) : undefined;
};

const remove = (res: Response, name: string) => {
  res.clearCookie(name);
};

export const cookie = {
  set,
  get,
  remove,
};
