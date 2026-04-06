import { Router } from 'express';

import authRouter from './authRoutes.js';
import minifigsRouter from './minifigsRoutes.js';
import themesRouter from './themesRoutes.js';
import userRouter from './usersRoutes.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/minifigs', minifigsRouter);
router.use('/themes', themesRouter);
router.use('/user', userRouter);

export default router;
