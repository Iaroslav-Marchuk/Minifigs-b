import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

app.use(
  pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
);

export default app;
