import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

import { UsersCollection } from '../db/models/userModel.js';
import { SessionsCollection } from '../db/models/sessionModel.js';
import {
  ACCESS_TOKEN_EXP,
  REFRESH_TOKEN_EXP,
  SMTP,
  TEMPLATES_DIR,
} from '../constants/constants.js';
import { getEnvVariable } from '../utils/getEnvVariable.js';
import { sendEmail } from '../utils/sendEmail.js';
import {
  getFullNameFromGoogleTokenPayload,
  validateCode,
} from '../utils/googleOAuth2.js';

const JWT_SECRET = getEnvVariable('JWT_SECRET');

export const registerUserService = async ({ name, email, password }) => {
  const user = await UsersCollection.findOne({ email: email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(password, 10);

  return await UsersCollection.create({
    name,
    email,
    password: encryptedPassword,
  });
};

export const loginUserService = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email: email });
  if (!user) throw createHttpError(401, 'Invalid email or password!');

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Invalid email or password!');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXP / 1000,
  });
  const refreshToken = randomBytes(30).toString('base64');

  await SessionsCollection.create({
    userId: user._id,
    refreshToken,
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_EXP),
  });

  return {
    accessToken,
    refreshToken,
    user: {
      name: user.name,
      email: user.email,
    },
  };
};

export const logoutUserService = async (refreshToken) => {
  await SessionsCollection.deleteOne({ refreshToken });
};

export const refreshSessionService = async (refreshToken) => {
  if (!refreshToken) {
    throw createHttpError(401, 'No refresh token!');
  }

  const currentSession = await SessionsCollection.findOne({ refreshToken });

  if (!currentSession) {
    throw createHttpError(401, 'Session not found!');
  }

  const isRefreshTokenExpired =
    new Date() > new Date(currentSession.refreshTokenValidUntil);

  if (isRefreshTokenExpired) {
    throw createHttpError(401, 'Refresh token expired');
  }

  await SessionsCollection.deleteOne({ refreshToken });

  const newAccessToken = jwt.sign(
    { userId: currentSession.userId },
    JWT_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXP / 1000,
    },
  );
  const newRefreshToken = randomBytes(30).toString('base64');

  await SessionsCollection.create({
    userId: currentSession.userId,
    refreshToken: newRefreshToken,
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_EXP),
  });

  const user = await UsersCollection.findById(currentSession.userId).select(
    '-password',
  );

  return { accessToken: newAccessToken, refreshToken: newRefreshToken, user };
};

export const requestResetTokenService = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) throw createHttpError(404, 'User not found!');

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVariable('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${getEnvVariable('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: getEnvVariable(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });
};

export const resetUserPasswordService = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVariable('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );

  await SessionsCollection.deleteMany({ userId: user._id });
};

export const changePasswordService = async (userId, oldPass, newPass) => {
  const user = await UsersCollection.findById(userId);

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const isEqual = await bcrypt.compare(oldPass, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Invalid password!');
  }

  const encryptedNewPassword = await bcrypt.hash(newPass, 10);

  user.password = encryptedNewPassword;
  await user.save();

  await SessionsCollection.deleteOne({ userId: user._id });

  const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXP / 1000,
  });
  const refreshToken = randomBytes(30).toString('base64');

  await SessionsCollection.create({
    userId: user._id,
    refreshToken,
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_EXP),
  });

  return {
    accessToken,
    refreshToken,
    user: {
      name: user.name,
      email: user.email,
    },
  };
};

export const changeUserNameService = async (userId, newName) => {
  const user = await UsersCollection.findOneAndUpdate(
    { _id: userId },
    { name: newName },
    { new: true },
  );

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  return {
    user: {
      name: user.name,
      email: user.email,
    },
  };
};

export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();
  if (!payload) throw createHttpError(401, 'Unauthorized');

  let user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    const password = await bcrypt.hash(randomBytes(10).toString('hex'), 10);
    user = await UsersCollection.create({
      email: payload.email,
      name: getFullNameFromGoogleTokenPayload(payload),
      password,
    });
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXP / 1000,
  });
  const refreshToken = randomBytes(30).toString('base64');

  await SessionsCollection.create({
    userId: user._id,
    refreshToken,
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_EXP),
  });

  return {
    accessToken,
    refreshToken,
    user: {
      name: user.name,
      email: user.email,
    },
  };
};
