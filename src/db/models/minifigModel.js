import { Schema, model } from 'mongoose';

const minifigSchema = new Schema(
  {
    fig_num: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    num_parts: {
      type: Number,
      required: true,
    },
    img_url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const minifigsCollection = model('Minifig', minifigSchema);
