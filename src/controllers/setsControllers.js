import { getMinifigByIdService } from '../services/minifigsServices.js';
import { getSetsByFigNumService } from '../services/setsServices.js';

export const getSetsByFigNumController = async (req, res) => {
  const { minifigId } = req.params;
  const minifig = await getMinifigByIdService(minifigId);

  const sets = await getSetsByFigNumService(minifig.fig_num);

  res.status(200).json({
    message: `Successfully found set(s) for minifig ${minifig.fig_num}`,
    data: sets,
  });
};
