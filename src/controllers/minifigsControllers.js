import { getAllMinifigsService } from '../services/minifigsServices.js';

export const getAllMinifigsController = async (req, res) => {
  const minifigs = await getAllMinifigsService();

  res.status(200).json({
    message: 'Successfully found minifigs!',
    data: { minifigs },
  });
};
