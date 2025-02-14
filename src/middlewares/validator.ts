import { NextFunction, Request, RequestHandler, Response } from "express";
import { z } from "zod";

const validateData = (
  schema: z.ZodObject<any, any> | z.ZodEffects<z.ZodObject<any, any>>,
  source: "body" | "params" | "query"
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req[source]);

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res.status(400).json({ error: "invalid data", details: errorMessages });
      } else {
        next(error);
      }
    }
  };
};

const validateRequestBody = (schema: z.ZodObject<any, any> | z.ZodEffects<z.ZodObject<any, any>>): RequestHandler =>
  validateData(schema, "body");
const validateRequestParams = (schema: z.ZodObject<any, any>): RequestHandler => validateData(schema, "params");
const validateRequestQuery = (schema: z.ZodObject<any, any>): RequestHandler => validateData(schema, "query");

export const validator = {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
};
