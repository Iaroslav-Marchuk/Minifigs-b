import { model, Schema } from 'mongoose';

const themeSchema = new Schema(
  {
    id: Number,
    name: String,
  },
  { versionKey: false },
);

export const ThemesCollection = model('Theme', themeSchema);
