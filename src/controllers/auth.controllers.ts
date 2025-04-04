import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';

export const googleLoginCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const currentWorkSpace = req.user?.currentWorkspace;
  }
);
