import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://10.0.0.10:6379'
});

const connectRedis = async () => {
  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  await redisClient.connect();
};

const redisPromise = connectRedis();

export { redisClient, redisPromise };
