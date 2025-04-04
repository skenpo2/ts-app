import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';

import cors from 'cors';
import session from 'cookie-session';
import { config } from './config/app.config';
import connectDB from './config/database.config';

import authRoutes from './routes/auth.routes';

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: 'session',
    keys: [config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  })
);

app.use(cors());

app.use(`${BASE_PATH}/auth`, authRoutes);

app.listen(config.PORT, () => {
  console.log(`App is listening on port:${config.PORT}`);
  connectDB();
});
