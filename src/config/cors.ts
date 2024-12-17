import { CorsOptions } from 'cors';
import { allowedOrigins } from './origins';

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },

  credentials: true, // Allow credentials (cookies, etc.)
  optionsSuccessStatus: 200, // For legacy browser support
};
