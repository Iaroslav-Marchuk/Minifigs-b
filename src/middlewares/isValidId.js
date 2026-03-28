import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const isValidId = (req, res, next) => {
  const { minifigId } = req.params;
  if (!isValidObjectId(minifigId)) {
    throw createHttpError(400, 'Bad request!');
  }

  next();
};
