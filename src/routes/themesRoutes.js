import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getAllThemesController } from '../controllers/themesControllers.js';

const router = Router();

router.get('/', ctrlWrapper(getAllThemesController));

export default router;
