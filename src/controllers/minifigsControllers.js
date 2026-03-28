import {
  getAllMinifigsService,
  getMinifigByIdService,
} from '../services/minifigsServices.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';

export const getAllMinifigsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  //   const { sortBy, sortOrder } = parseSortParams(req.query);
  //   const filter = parseFilterParams(req.query);

  const allMinifigs = await getAllMinifigsService({
    page,
    perPage,
    //     sortBy,
    //     sortOrder,
    //     filter,
  });

  res.status(200).json({
    message: 'Successfully found minifigs!',
    data: allMinifigs,
  });
};

export const getMinifigByIdController = async (req, res) => {
  const { minifigId } = req.params;
  const minifig = await getMinifigByIdService(minifigId);

  res.status(200).json({
    message: `Successfully found minifig with id ${minifigId}`,
    data: minifig,
  });
};
