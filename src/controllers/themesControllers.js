import {
  //   getAllMinifigsByThemeService,
  getAllThemesService,
} from '../services/themesServices.js';

export const getAllThemesController = async (req, res) => {
  const allThemes = await getAllThemesService();

  res.status(200).json({
    message: 'Successfully found all themes!',
    data: allThemes,
  });
};

// export const getAllMinifigsByThemeController = async (req, res) => {
//   const { themeId } = req.params;
//   const minifigs = await getAllMinifigsByThemeService(themeId);

//   res.status(200).json({
//     message: `Successfully found minifigs by theme with id ${themeId}`,
//     data: minifigs,
//   });
// };
