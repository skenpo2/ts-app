import express from 'express';
import passport from 'passport';
import { config } from '../config/app.config';
import {
  googleLoginCallback,
  loginController,
  logoutController,
  registerUserController,
} from '../controllers/auth.controllers';

const router = express.Router();

const failureURL = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;

router.post('/register', registerUserController);
router.post('/login', loginController);
router.post('/logout', logoutController);
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: failureURL }),
  googleLoginCallback
);

export default router;
