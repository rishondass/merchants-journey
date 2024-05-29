import { createClient } from 'redis';

export const client = createClient({
  url: 'redis://10.0.0.10:6379'
});

client.on('error', (err) => console.error('Redis Client Error', err));

const main = async()=>{
  await client.connect();
}

main();

