import 'dotenv/config';

import cors from 'cors';
import express from 'express';

import cookieParser from 'cookie-parser';

import { paths } from '@config';
import { connectDB } from '@lib';
import { customerRoutes, distributionRoutes, freezoneRoutes, orderRoutes, productRoutes } from '@routes';

const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || 'development';
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers'
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
  res.setHeader('Access-Control-Max-Age', 7200);

  next();
});

app.use(cookieParser());

// routes
app.use(paths.root, productRoutes);
app.use(paths.root, customerRoutes);
app.use(paths.root, orderRoutes);
app.use(paths.root, freezoneRoutes);
app.use(paths.root, distributionRoutes);

app.listen(PORT, async () => {
  console.log(`Server is running on PORT ${PORT} on an ${NODE_ENV.toUpperCase()} environment`);

  await connectDB();
});
