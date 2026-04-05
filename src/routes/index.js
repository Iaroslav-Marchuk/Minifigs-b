import { Router } from 'express';

import authRouter from './authRoutes.js';
import minifigsRouter from './minifigsRoutes.js';
import themesRouter from './themesRoutes.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/minifigs', minifigsRouter);
router.use('/themes', themesRouter);

export default router;
