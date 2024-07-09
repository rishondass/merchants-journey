import { createClient } from 'redis';

export const client = createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => console.error('Redis Client Error', err));

const main = async()=>{
  await client.connect();
}

main();

