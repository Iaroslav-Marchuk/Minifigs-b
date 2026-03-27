import 'dotenv/config';

import { initMongoDB } from './db/initMongoDB.js';
import { startServer } from './server.js';

const bootstrap = async () => {
  await initMongoDB();
  startServer();
  console.log(startServer);
};

bootstrap().catch((error) => console.error(error));
