import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';

import cors from 'cors';
import session from 'cookie-session';
import { config } from './config/app.config';
import connectDB from './config/database.config';

import './config/passport.config';
import passport from 'passport';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

import { asyncHandler } from './middlewares/asyncHandler';
import { BadRequestException } from './utils/appError';
import { ErrorCodeEnum } from './enums/error-code-enums';
import { HTTPSTATUS } from './config/http.config';

const app = express();
const BASE_PATH = 'http://localhost:8000/api';

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

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.listen(8000, () => {
  console.log(`App is listening on port:${config.PORT}`);
  connectDB();
});
