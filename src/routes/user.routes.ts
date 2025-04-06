import express from 'express';
import { getCurrentUserController } from '../controllers/user.controller';

const router = express.Router();

router.get('/current', getCurrentUserController);

export default router;
