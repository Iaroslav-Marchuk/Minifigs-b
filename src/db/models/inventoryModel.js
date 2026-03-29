import { Schema, model } from 'mongoose';

const inventorySchema = new Schema(
  {
    id: Number,
    set_num: String,
    version: Number,
  },
  {
    collection: 'inventories',
    versionKey: false,
  },
);

export const InventoriesCollection = model('Inventory', inventorySchema);
