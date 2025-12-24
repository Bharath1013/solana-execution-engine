import { Worker, Job } from 'bullmq';
import prisma from '../../dbclient.js'; 
import { redisConnection, QUEUE_NAME } from '../config/redis.js';
import { connection as solanaConnection, getWallet } from '../services/solanaService.js';
import { getBestQuote } from '../services/routingService.js';
import { executeSwap } from '../services/executionService.js';


export const orderWorker = new Worker(
  QUEUE_NAME,
  async (job: Job) => {
    const { orderId, inputMint, outputMint, amount } = job.data;
    const wallet = getWallet();
    

    const notify = async (step: string, status: 'PENDING' | 'SUCCESS' | 'FAILED', details?: any) => {
      console.log(`[Order ${orderId}] ${step}: ${status}`);

     
      await prisma.executionStep.create({
        data: { orderId, name: step, status: status }
      });

    
      const payload = JSON.stringify({
        orderId,
        step,
        status,
        details,
        timestamp: Date.now()
      });
      await redisConnection.publish('order-updates', payload);
    };

    try {
      
    await new Promise(r => setTimeout(r, 6000));
   
      await notify('ROUTING', 'PENDING', 'Querying Raydium & Meteora...');
      const bestQuote = await getBestQuote({orderId,inputMint, outputMint, amount});
      await notify('ROUTING', 'SUCCESS', { dex: bestQuote?.dex, outAmount: bestQuote?.outAmount.toString() });

      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'PROCESSING' }
      });

    
      await notify('EXECUTION', 'PENDING', `Signing transaction for ${bestQuote?.dex}...`);
      const signature = await executeSwap(solanaConnection, wallet, bestQuote);
      console.log(`txhash of orderId${orderId} : ${signature}`)
      
      await notify('EXECUTION', 'SUCCESS', { signature });
      
      await prisma.order.update({
        where: { id: orderId },
        data: { 
          status: 'COMPLETED',
          txHash: signature 
        }
      });
        
      console.log(`✅ Order ${orderId} successfully executed on-chain!`);

    } catch (error: any) {
      console.error(`❌ Worker Error on Job ${job.id}:`, error.message);
      
      await notify('ERROR', 'FAILED', error.message);
      
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'FAILED' }
      });

      throw error;
    }
  },
  { 
    connection: redisConnection,
    concurrency: 5, 
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 }
  }
);


orderWorker.on('failed', (job, err) => {
  console.error(`🚨 Job ${job?.id} permanently failed: ${err.message}`);
});

console.log('👷 Worker is active and listening for Solana orders...');