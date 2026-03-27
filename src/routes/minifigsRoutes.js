import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { getAllMinifigsController } from '../controllers/minifigsControllers.js';

const router = Router();

router.get('/', ctrlWrapper(getAllMinifigsController));

export default router;
