import { REFRESH_TOKEN_EXP } from '../constants/constants.js';
import {
  changePasswordService,
  changeUserNameService,
  loginUserService,
  logoutUserService,
  refreshSessionService,
  registerUserService,
  requestResetTokenService,
  resetUserPasswordService,
} from '../services/authServices.js';

export const registerUserController = async (req, res) => {
  await registerUserService(req.body);

  res.status(201).json({
    message: 'New user registered successfully!',
  });
};

export const loginUserController = async (req, res) => {
  const { accessToken, refreshToken, user } = await loginUserService(req.body);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + REFRESH_TOKEN_EXP),
    sameSite: 'None',
    secure: true,
    path: '/',
  });

  res.status(200).json({
    message: 'User is successfully logged!',
    data: { accessToken, user },
  });
};

export const logoutUserController = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    await logoutUserService(refreshToken);
  }

  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    path: '/',
  });

  res.status(200).json({ message: 'Logged out successfully' });
};

export const refreshSessionController = async (req, res) => {
  const { refreshToken } = req.cookies;

  const { accessToken, refreshToken: newRefreshToken } =
    await refreshSessionService(refreshToken);

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + REFRESH_TOKEN_EXP),
    sameSite: 'None',
    secure: true,
    path: '/',
  });

  res.status(200).json({
    message: 'Token refreshed successfully!',
    data: { accessToken },
  });
};

export const requestResetTokenController = async (req, res) => {
  await requestResetTokenService(req.body.email);

  res.status(200).json({
    message: 'Reset password email was successfully sent!',
    data: {},
  });
};

export const resetUserPasswordController = async (req, res) => {
  await resetUserPasswordService(req.body);

  res.status(200).json({
    message: 'Password was successfully reset!',
    data: {},
  });
};

export const changePasswordController = async (req, res) => {
  const userId = req.user._id;
  const { oldPass, newPass } = req.body;

  const { accessToken, refreshToken, user } = await changePasswordService(
    userId,
    oldPass,
    newPass,
  );

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + REFRESH_TOKEN_EXP),
    sameSite: 'None',
    secure: true,
    path: '/',
  });

  res.status(200).json({
    message: 'Password changed successfully!',
    data: { accessToken, user },
  });
};

export const changeUserNameController = async (req, res) => {
  const userId = req.user._id;
  const { newName } = req.body;

  const { user } = await changeUserNameService(userId, newName);

  res.status(200).json({
    message: 'Name changed successfully!',
    data: { user },
  });
};
