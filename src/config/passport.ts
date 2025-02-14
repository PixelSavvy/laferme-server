import { getEnvVar } from "@/helpers";
import { ExtractJwt, StrategyOptionsWithoutRequest } from "passport-jwt";

export const options: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.accessToken]),
  secretOrKey: getEnvVar("JWT_SECRET"),
};
