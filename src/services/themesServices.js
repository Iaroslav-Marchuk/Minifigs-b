import { ThemesCollection } from '../db/models/themeModel.js';

export const getAllThemesService = async () => {
  const allThemes = await ThemesCollection.find().lean();
  return allThemes;
};
