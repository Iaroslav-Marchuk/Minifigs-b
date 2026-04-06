import { SORT_ORDER } from '../constants/constants.js';
import { InventoryMinifigsCollection } from '../db/models/inventoryMinifigsModel.js';
import { InventoriesCollection } from '../db/models/inventoryModel.js';
import { SetsCollection } from '../db/models/setModel.js';
import { UsersCollection } from '../db/models/userModel.js';
import { calculatePaginationData } from '../utils/parsePaginationParams.js';

export const getUserCollectionService = async (
  userId,
  page = 1,
  perPage = 40,
  themeId,
  search,
  sortOrder = SORT_ORDER.ASC,
  sortBy = 'name',
) => {
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

  if (search) {
    mongoFilter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { fig_num: { $regex: search, $options: 'i' } },
    ];
  }
  const userForCount = await UsersCollection.findById(userId).populate({
    path: 'collection',
    match: mongoFilter,
    select: '_id',
  });
  const minifigsCount = userForCount.collection.length;

  const user = await UsersCollection.findById(userId).populate({
    path: 'collection',
    match: mongoFilter,
    options: {
      sort: { [sortBy]: sortOrder },
      skip,
      limit,
    },
  });

  const collection = user.collection;

  const paginationData = calculatePaginationData(minifigsCount, page, perPage);

  return { collection, ...paginationData };
};

export const addItemToUserCollectionService = async (userId, minifigId) => {
  return await UsersCollection.findByIdAndUpdate(
    userId,
    { $addToSet: { collection: minifigId } },
    { new: true },
  );
};

export const deleteItemFromUserCollectionService = async (
  userId,
  minifigId,
) => {
  return await UsersCollection.findByIdAndUpdate(
    userId,
    { $pull: { collection: minifigId } },
    { new: true },
  );
};

export const getUserWishListService = async (
  userId,
  page = 1,
  perPage = 40,
  themeId,
  search,
  sortOrder = SORT_ORDER.ASC,
  sortBy = 'name',
) => {
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

  if (search) {
    mongoFilter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { fig_num: { $regex: search, $options: 'i' } },
    ];
  }

  const userForCount = await UsersCollection.findById(userId).populate({
    path: 'wishList',
    match: mongoFilter,
    select: '_id',
  });
  const minifigsCount = userForCount.wishList.length;

  const user = await UsersCollection.findById(userId).populate({
    path: 'wishList',
    match: mongoFilter,
    options: {
      sort: { [sortBy]: sortOrder },
      skip,
      limit,
    },
  });

  const wishList = user.wishList;

  const paginationData = calculatePaginationData(minifigsCount, page, perPage);

  return { wishList, ...paginationData };
};

export const addItemToUserWishListService = async (userId, minifigId) => {
  return await UsersCollection.findByIdAndUpdate(
    userId,
    { $addToSet: { wishList: minifigId } },
    { new: true },
  );
};

export const deleteItemFromUserWishListService = async (userId, minifigId) => {
  return await UsersCollection.findByIdAndUpdate(
    userId,
    { $pull: { wishList: minifigId } },
    { new: true },
  );
};
