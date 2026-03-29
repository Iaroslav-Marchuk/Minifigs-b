import { Schema, model } from 'mongoose';

const minifigSchema = new Schema(
  {
    fig_num: String,
    name: String,
    num_parts: Number,
    img_url: String,
  },
  {
    versionKey: false,
  },
);

export const MinifigsCollection = model('Minifig', minifigSchema);
