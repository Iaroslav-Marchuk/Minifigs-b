import {
  getAllMinifigsService,
  getMinifigByIdService,
  getSetsByFigNumService,
} from '../services/minifigsServices.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getAllMinifigsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const { search, theme } = parseFilterParams(req.query);

  const allMinifigs = await getAllMinifigsService({
    page,
    perPage,
    themeId: theme,
    search,
    sortOrder,
    sortBy,
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

export const getSetsByFigNumController = async (req, res) => {
  const { minifigId } = req.params;
  const minifig = await getMinifigByIdService(minifigId);

  const sets = await getSetsByFigNumService(minifig.fig_num);

  res.status(200).json({
    message: `Successfully found set(s) for minifig ${minifig.fig_num}`,
    data: sets,
  });
};
