import { getEnvVar } from "@/helpers";

export const allowedOrigins = [getEnvVar("CLIENT_URL")];
