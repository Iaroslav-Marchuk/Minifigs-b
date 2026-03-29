import { model, Schema } from 'mongoose';

const setSchema = new Schema(
  {
    set_num: String,
    name: String,
    year: Number,
    theme_id: Number,
    num_parts: Number,
    img_url: String,
  },
  {
    versionKey: false,
  },
);

export const SetsCollection = model('Set', setSchema);
