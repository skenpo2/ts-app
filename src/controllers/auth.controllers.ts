import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { config } from '../config/app.config';
import passport from 'passport';
import { HTTPSTATUS } from '../config/http.config';
import { registerSchema } from '../validation/auth.validation';
import { registerUserService } from '../services/auth.service';

export const googleLoginCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const currentWorkspace = req.user?.currentWorkspace;

    if (!currentWorkspace) {
      return res.redirect(
        `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
      );
    }

    return res.redirect(
      `${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`
    );
  }
);

export const registerUserController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = registerSchema.parse({ ...req.body });

    await registerUserService(body);
    res.status(HTTPSTATUS.OK).json({
      message: 'User registered successfully',
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      'local',
      (
        err: Error | null,
        user: Express.User | false,
        info: { message: string } | undefined
      ) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(HTTPSTATUS.UNAUTHORIZED).json({
            message: info?.message || 'Invalid email or password',
          });
        }

        req.login(user, (err) => {
          if (err) {
            return next(err);
          }

          return res.status(HTTPSTATUS.OK).json({
            message: 'Logged in successfully',
            user,
          });
        });
      }
    )(req, res, next);
  }
);

export const logoutController = asyncHandler(
  async (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res
          .status(HTTPSTATUS.INTERNAL_SERVER_ERROR)
          .json({ error: 'Failed to log out' });
      }
    });
    req.session = null;
    return res
      .status(HTTPSTATUS.OK)
      .json({ message: 'Logged out successfully' });
  }
);
