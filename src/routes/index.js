import { Router } from 'express';

import minifigsRouter from './minifigsRoutes.js';
import themesRouter from './themesRoutes.js';

const router = Router();

router.use('/minifigs', minifigsRouter);
router.use('/themes', themesRouter);

export default router;
