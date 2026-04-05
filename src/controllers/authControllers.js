import { REFRESH_TOKEN_EXP } from '../constants/constants.js';
import {
  loginUserService,
  logoutUserService,
  refreshSessionService,
  registerUserService,
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
