import createHttpError from 'http-errors';

import { MinifigsCollection } from '../db/models/minifigModel.js';
import { calculatePaginationData } from '../utils/parsePaginationParams.js';

export const getAllMinifigsService = async ({
  page = 1,
  perPage = 20,
  //   sortOrder = SORT_ORDER.ASC,
  //   sortBy = 'createdAt',
  //   filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const mongoFilter = {};

  const ordersCount = await MinifigsCollection.countDocuments(mongoFilter);

  const allMinifigs = await MinifigsCollection.find(mongoFilter)
    .skip(skip)
    .limit(limit)
    .lean();

  const paginationData = calculatePaginationData(ordersCount, page, perPage);

  return { allMinifigs, ...paginationData };
};

export const getMinifigByIdService = async (minifigId) => {
  const minifig = await MinifigsCollection.findById(minifigId);

  if (!minifig) {
    throw createHttpError(404, 'Minifig not found');
  }

  return minifig;
};
