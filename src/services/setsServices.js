import createHttpError from 'http-errors';
import { InventoryMinifigsCollection } from '../db/models/inventoryMinifigsModel.js';
import { InventoriesCollection } from '../db/models/inventoryModel.js';
import { SetsCollection } from '../db/models/setModel.js';

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
