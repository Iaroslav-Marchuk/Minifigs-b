import { Router } from 'express';

import minifigsRouter from './minifigsRoutes.js';

const router = Router();

router.use('/minifigs', minifigsRouter);

export default router;
