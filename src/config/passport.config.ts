import { Request } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { config } from './app.config';

import { NotFoundException } from '../utils/appError';
import { loginOrCreateAccountService } from '../services/auth.service';
import { ProviderEnum } from '../enums/account-provider.enum';

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
      passReqToCallback: true,
    },
    async (req: Request, accessToken, refreshToken, profile, done) => {
      try {
        const { email, sub: googleId, picture } = profile._json;

        if (!googleId) {
          throw new NotFoundException('Google ID (sub) is missing');
        }

        const { user } = loginOrCreateAccountService({
          provider: ProviderEnum.GOOGLE,
          displayName: profile.displayName,
          providerId: googleId,
          picture: picture,
          email: email,
        });
        done(null, user);
      } catch (error) {}
    }
  )
);
