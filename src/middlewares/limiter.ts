import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 0.5 * 60 * 1000, // 30 seconds
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 30 seconds",
});
