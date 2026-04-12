import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginUserSchema,
  registerUserSchema,
  requestResetUserPasswordSchema,
  resetUserPasswordSchema,
} from '../validation/userValidation.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserController,
  logoutUserController,
  refreshSessionController,
  registerUserController,
  requestResetTokenController,
  resetUserPasswordController,
} from '../controllers/authControllers.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/logout', ctrlWrapper(logoutUserController));

router.post('/refresh', ctrlWrapper(refreshSessionController));

router.post(
  '/request-reset-email',
  validateBody(requestResetUserPasswordSchema),
  ctrlWrapper(requestResetTokenController),
);

router.post(
  '/reset-password',
  validateBody(resetUserPasswordSchema),
  ctrlWrapper(resetUserPasswordController),
);

export default router;
