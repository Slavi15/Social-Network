import { createClient } from 'redis';
import env from '@/lib/env';

const redisClient = createClient({
  socket: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    reconnectStrategy: (retries) => Math.min(retries * 100, 5000)
  },
  password: env.REDIS_PASSWORD
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// (async () => {
//   try {
//     await redisClient.connect();
//     console.log('Connected to Redis');
//   } catch (err) {
//     console.error('Redis connection failed:', err);
//     process.exit(1);
//   }
// })();

export default redisClient;