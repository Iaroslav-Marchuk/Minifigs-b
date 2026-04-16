import {
  addItemToUserCollectionService,
  addItemToUserWishListService,
  clearUserCollectionService,
  clearUserWishListService,
  deleteItemFromUserCollectionService,
  deleteItemFromUserWishListService,
  getUserCollectionService,
  getUserWishListService,
} from '../services/usersServices.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getUserCollectionController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const { search, theme } = parseFilterParams(req.query);

  const userId = req.user._id;

  const collection = await getUserCollectionService({
    userId,
    page,
    perPage,
    themeId: theme,
    search,
    sortOrder,
    sortBy,
  });

  res.status(200).json({
    message: "Successfully found user's collection!",
    data: collection,
  });
};

export const addItemToUserCollectionController = async (req, res) => {
  const userId = req.user._id;
  const { minifigId } = req.params;

  const minifig = await addItemToUserCollectionService(userId, minifigId);

  res.status(200).json({
    message: "Successfully added item to user's collection!",
    data: minifig,
  });
};

export const deleteItemFromUserCollectionController = async (req, res) => {
  const userId = req.user._id;
  const { minifigId } = req.params;

  await deleteItemFromUserCollectionService(userId, minifigId);

  res.status(200).json({
    message: "Successfully deleted item from user's collection!",
  });
};

export const getUserWishListController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const { search, theme } = parseFilterParams(req.query);

  const userId = req.user._id;

  const wishList = await getUserWishListService({
    userId,
    page,
    perPage,
    themeId: theme,
    search,
    sortOrder,
    sortBy,
  });

  res.status(200).json({
    message: "Successfully found user's wish list!",
    data: wishList,
  });
};

export const addItemToUserWishListController = async (req, res) => {
  const userId = req.user._id;
  const { minifigId } = req.params;

  const minifig = await addItemToUserWishListService(userId, minifigId);

  res.status(200).json({
    message: "Successfully added item to user's wish list!",
    data: minifig,
  });
};

export const deleteItemFromUserWishListController = async (req, res) => {
  const userId = req.user._id;
  const { minifigId } = req.params;

  await deleteItemFromUserWishListService(userId, minifigId);

  res.status(200).json({
    message: "Successfully deleted item from user's wish list!",
  });
};

export const clearUserCollectionController = async (req, res) => {
  const userId = req.user._id;

  const user = await clearUserCollectionService(userId);

  res.status(200).json({
    message: 'Successfully cleared user collection!',
    data: user,
  });
};

export const clearUserWishListController = async (req, res) => {
  const userId = req.user._id;

  const user = await clearUserWishListService(userId);

  res.status(200).json({
    message: 'Successfully cleared user wishlist!',
    data: user,
  });
};
