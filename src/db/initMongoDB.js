import mongoose from 'mongoose';

import { getEnvVariable } from '../utils/getEnvVariable.js';

export const initMongoDB = async () => {
  try {
    const user = getEnvVariable('MONGODB_USER');
    const password = getEnvVariable('MONGODB_PASSWORD');
    const url = getEnvVariable('MONGODB_URL');
    const db = getEnvVariable('MONGODB_DB');

    const uri = `mongodb+srv://${user}:${password}@${url}/${db}?appName=Cluster0`;

    await mongoose.connect(uri);

    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.log('Error while setting up mongo connection', error);
    throw error;
  }
};
