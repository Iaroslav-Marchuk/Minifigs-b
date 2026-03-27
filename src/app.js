import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

import router from './routes/index.js';

const allowedOrigin = 'http://localhost:5173';
// const allowedOrigin = 'https://register-f-plum.vercel.app';

const app = express();

app.use(express.json());
app.use(cors({ origin: allowedOrigin, credentials: true }));

app.use(
  pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
);

app.use(router);

app.use('*splat', notFoundHandler);
app.use(errorHandler);

export default app;
