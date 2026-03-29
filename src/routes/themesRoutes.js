import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  //   getAllMinifigsByThemeController,
  getAllThemesController,
} from '../controllers/themesControllers.js';

const router = Router();

router.get('/', ctrlWrapper(getAllThemesController));
// router.get(
//   '/:themeId/minifigs',

//   ctrlWrapper(getAllMinifigsByThemeController),
// );

export default router;
