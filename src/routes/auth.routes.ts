import express from 'express';
import passport from 'passport';
import { config } from '../config/app.config';
import { googleLoginCallback } from '../controllers/auth.controllers';

const router = express.Router();

const failureURL = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;

router.post('/register');
router.post('/login');
router.post('/logout');
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: failureURL })
  //   googleLoginCallback
);

export default router;
