import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import {
  changePasswordSchema,
  changeUserNameSchema,
  loginUserSchema,
  registerUserSchema,
  requestResetUserPasswordSchema,
  resetUserPasswordSchema,
} from '../validation/userValidation.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  changePasswordController,
  changeUserNameController,
  getGoogleOAuthUrlController,
  loginUserController,
  loginWithGoogleController,
  logoutUserController,
  refreshSessionController,
  registerUserController,
  requestResetTokenController,
  resetUserPasswordController,
} from '../controllers/authControllers.js';
import { authenticate } from '../middlewares/authenticate.js';
import { loginWithGoogleOAuthSchema } from '../validation/authValidation.js';

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

router.patch(
  '/change-password',
  authenticate,
  validateBody(changePasswordSchema),
  ctrlWrapper(changePasswordController),
);

router.patch(
  '/change-name',
  authenticate,
  validateBody(changeUserNameSchema),
  ctrlWrapper(changeUserNameController),
);

router.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));

router.post(
  '/confirm-oauth',
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(loginWithGoogleController),
);

export default router;
