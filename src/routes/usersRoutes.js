import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  addItemToUserCollectionController,
  addItemToUserWishListController,
  clearUserCollectionController,
  clearUserWishListController,
  deleteItemFromUserCollectionController,
  deleteItemFromUserWishListController,
  getUserCollectionController,
  getUserWishListController,
} from '../controllers/usersControllers.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.get(
  '/mycollection',
  authenticate,
  ctrlWrapper(getUserCollectionController),
);

router.post(
  '/mycollection/:minifigId',
  authenticate,
  ctrlWrapper(addItemToUserCollectionController),
);

router.delete(
  '/mycollection/:minifigId',
  authenticate,
  ctrlWrapper(deleteItemFromUserCollectionController),
);

router.get('/mywishlist', authenticate, ctrlWrapper(getUserWishListController));

router.post(
  '/mywishlist/:minifigId',
  authenticate,
  ctrlWrapper(addItemToUserWishListController),
);

router.delete(
  '/mywishlist/:minifigId',
  authenticate,
  ctrlWrapper(deleteItemFromUserWishListController),
);

router.delete(
  '/mycollection/clear',
  authenticate,
  ctrlWrapper(clearUserCollectionController),
);

router.delete(
  '/mywishlist/clear',
  authenticate,
  ctrlWrapper(clearUserWishListController),
);

export default router;
