import createHttpError from 'http-errors';

import { MinifigsCollection } from '../db/models/minifigModel.js';
import { calculatePaginationData } from '../utils/parsePaginationParams.js';
import { InventoryMinifigsCollection } from '../db/models/inventoryMinifigsModel.js';
import { InventoriesCollection } from '../db/models/inventoryModel.js';
import { SetsCollection } from '../db/models/setModel.js';

export const getAllMinifigsService = async ({
  page = 1,
  perPage = 20,
  themeId,
  query,
  //   sortOrder = SORT_ORDER.ASC,
  //   sortBy = 'createdAt',
  //   filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const mongoFilter = {};

  if (themeId) {
    const sets = await SetsCollection.find({
      theme_id: Number(themeId),
    }).lean();
    const setNums = sets.map((item) => item.set_num);
    const inventories = await InventoriesCollection.find({
      set_num: { $in: setNums },
    }).lean();
    const inventoryIds = inventories.map((item) => item.id);
    const inventoryMinifigs = await InventoryMinifigsCollection.find({
      inventory_id: { $in: inventoryIds },
    }).lean();
    const figNums = inventoryMinifigs.map((item) => item.fig_num);
    mongoFilter.fig_num = { $in: figNums };
  }

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

export const getSetsByFigNumService = async (figNum) => {
  const inventoryMinifigs = await InventoryMinifigsCollection.find({
    fig_num: figNum,
  }).lean();
  if (!inventoryMinifigs.length) {
    throw createHttpError(404, 'Sets not found!');
  }

  const inventoryIds = inventoryMinifigs.map((item) => item.inventory_id);
  const inventories = await InventoriesCollection.find({
    id: { $in: inventoryIds },
  }).lean();
  const setNums = inventories.map((item) => item.set_num);
  const sets = await SetsCollection.find({
    set_num: { $in: setNums },
  }).lean();

  return sets;
};

// export const getAllMinifigsByThemeService = async (themeId) => {
//   const sets = await SetsCollection.find({ theme_id: themeId }).lean();
//   const setNums = sets.map((item) => item.set_num);

//   const inventories = await InventoriesCollection.find({
//     set_num: { $in: setNums },
//   }).lean();
//   const inventoryIds = inventories.map((item) => item.id);

//   const inventoryMinifigs = await InventoryMinifigsCollection.find({
//     inventory_id: { $in: inventoryIds },
//   }).lean();
//   const figNums = inventoryMinifigs.map((item) => item.fig_num);

//   const minifigs = await MinifigsCollection.find({
//     fig_num: { $in: figNums },
//   }).lean();

//   return minifigs;
// };
