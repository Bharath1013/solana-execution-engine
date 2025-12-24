import { Queue } from 'bullmq';
import { redisConnection, QUEUE_NAME } from '../config/redis.js';


export const orderQueue = new Queue(QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3, 
    backoff: {
      type: 'exponential',
      delay: 5000, 
    },
    removeOnComplete: true, 
    removeOnFail: false,   
  },
});

console.log(`✅ BullMQ Queue initialized: ${QUEUE_NAME}`);