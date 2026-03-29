import { getAllThemesService } from '../services/themesServices.js';

export const getAllThemesController = async (req, res) => {
  const allThemes = await getAllThemesService();

  res.status(200).json({
    message: 'Successfully found all themes!',
    data: allThemes,
  });
};
