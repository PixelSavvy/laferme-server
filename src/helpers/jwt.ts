import jwt, { Jwt, JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken";
import { z } from "zod";

import { userSchema } from "@/validators";
import { getEnvVar } from "./getEnv";

const generate = (user: Partial<z.infer<typeof userSchema>>, options?: SignOptions) => {
  const payload = { id: user.id, email: user.email };
  const secret = getEnvVar("JWT_SECRET");

  return jwt.sign(payload, secret, options);
};

const verify = (token: string, options?: VerifyOptions): JwtPayload | Jwt | string => {
  try {
    const secret = getEnvVar("JWT_SECRET");
    return jwt.verify(token, secret, options);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to verify token: ${errorMessage}`);
  }
};

export const token = {
  generate,
  verify,
};
