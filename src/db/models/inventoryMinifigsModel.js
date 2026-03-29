import { model, Schema } from 'mongoose';

const inventoryMinifigsSchema = new Schema(
  {
    inventory_id: Number,
    fig_num: String,
    quantity: Number,
  },
  {
    collection: 'inventory_minifigs',
    versionKey: false,
  },
);

export const InventoryMinifigsCollection = model(
  'InventoryMinifig',
  inventoryMinifigsSchema,
);
