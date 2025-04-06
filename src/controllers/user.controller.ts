import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { getCurrentUserService } from '../services/user.service';
import { HTTPSTATUS } from '../config/http.config';

export const getCurrentUserController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;

    const { user } = await getCurrentUserService(userId);

    res.status(HTTPSTATUS.OK).json({
      message: 'User fetch successfully',
      user,
    });
  }
);
