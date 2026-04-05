import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

import { getEnvVariable } from '../utils/getEnvVariable.js';
import { UsersCollection } from '../db/models/userModel.js';

const secretKey = getEnvVariable('JWT_SECRET');

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createHttpError(401, 'Not authorized'));
  }

  const actualAccessToken = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(actualAccessToken, secretKey);
    const user = await UsersCollection.findById(decoded.userId);

    if (!user) {
      return next(createHttpError(401, 'User not found!'));
    }

    req.user = user;

    next();
  } catch {
    next(createHttpError(401, 'Token is expired or invalid'));
  }
};
