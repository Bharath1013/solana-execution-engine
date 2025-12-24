import Fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import orderRoutes from './routes/orderRoutes.js';
import './workers/index.js'; 

dotenv.config();

const app = Fastify({ 
  logger: {
    transport: {
      target: 'pino-pretty', 
      options: {
        colorize: true
      }
    }
  }
});

async function bootstrap() {
  try {
    await app.register(cors, {
      origin: '*', 
    });

   
    await app.register(fastifyWebsocket, {
      options: { 
        maxPayload: 1048576 
      }
    });

    await app.register(orderRoutes);

   
    app.get('/health', async () => {
      return { status: 'ok', uptime: process.uptime() };
    });

 
    const PORT = Number(process.env.PORT) || 3000;
    await app.listen({ 
      port: PORT, 
      host: '0.0.0.0' 
    });

    console.log(`SOLANA EXECUTION ENGINE IS LIVE ON PORT:${PORT}`);

  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

bootstrap();