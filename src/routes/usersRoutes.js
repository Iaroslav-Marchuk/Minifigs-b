import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  addItemToUserCollectionController,
  addItemToUserWishListController,
  deleteItemFromUserCollectionController,
  deleteItemFromUserWishListController,
  getUserCollectionController,
  getUserWishListController,
} from '../controllers/usersControllers.js';
import { authenticate } from '../middlewares/authenticante.js';

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
export default router;
