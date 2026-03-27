// import createHttpError from 'http-errors';

import { minifigsCollection } from '../db/models/minifigModel.js';

export const getAllMinifigsService = async () => {
  const minifigs = await minifigsCollection.find();
  return minifigs;
};
