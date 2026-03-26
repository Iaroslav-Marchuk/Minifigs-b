import app from './app.js';

import { getEnvVariable } from './utils/getEnvVariable.js';

const PORT = getEnvVariable('PORT') || 8080;

export const startServer = async () => {
  app.listen(PORT, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Server started on port ${PORT}`);
  });
};
