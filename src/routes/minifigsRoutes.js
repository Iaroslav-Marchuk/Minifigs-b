import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
  getAllMinifigsController,
  getMinifigByIdController,
} from '../controllers/minifigsControllers.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.get('/', ctrlWrapper(getAllMinifigsController));
router.get('/:minifigId', isValidId, ctrlWrapper(getMinifigByIdController));

export default router;
