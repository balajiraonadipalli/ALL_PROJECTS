import { createServer } from 'http';
import app from './app.js';
import { loadEnv } from './config/env.js';
import { connectToDatabase } from './config/db.js';

async function start() {
  const env = loadEnv();
  await connectToDatabase(env.MONGO_URI);

  const server = createServer(app);
  server.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API running on http://localhost:${env.PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err);
  process.exit(1);
});


