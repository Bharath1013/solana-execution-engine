import type { FastifyInstance, FastifyRequest } from 'fastify';
import prisma from '../../dbclient.js';
import { orderQueue } from '../queue/index.js';
import { redisConnection } from '../config/redis.js';
import { EventEmitter } from 'events';


const orderEvents = new EventEmitter();
const subClient = redisConnection.duplicate({
  enableReadyCheck: false,
  maxRetriesPerRequest: null
});

subClient.on('connect', () => {
  console.log("✅ Redis SubscribeClient Connected");
  subClient.subscribe('order-updates')
    .then(() => console.log("📡 Subscribed to order-updates"))
    .catch(console.error);
});


subClient.subscribe('order-updates').catch(err => console.error("Redis Sub Error", err));

subClient.on('message', (channel, message) => {
  if (channel === 'order-updates') {
    try {
      const data = JSON.parse(message);

      orderEvents.emit(String(data.orderId), data);
    } catch (e) {
      console.error("Failed to parse Redis message", e);
    }
  }
});

interface OrderParams {
  id: string;
}

export default async function orderRoutes(app: FastifyInstance) {
  
  app.post('/api/order', async (request, reply) => {
    const { inputMint, outputMint, amount } = request.body as any;
    
    const order = await prisma.order.create({
      data: { inputMint, outputMint, amount: (amount), status: 'PENDING' }
    });

    await orderQueue.add('execute-swap', {
      orderId: order.id,
      inputMint,
      outputMint,
      amount: Number(amount)
    });

    return { orderId: order.id };
  });


  app.get<{ Params: OrderParams }>(
    '/api/order/watch/:id', 
    { websocket: true }, 
    (connection, request) => {
      const socket = connection;
      const orderId = request.params.id;

      if (!socket) {
        app.log.error("WebSocket connection failed: Socket is undefined");
        return;
      }

      app.log.info(`📡 WS connected for order: ${orderId}`);

  
  const handleUpdate = async (data: any) => {
  console.log(`Socket Update [${data.status}]:`, data.step);


  if (socket.readyState === 1) {
    socket.send(JSON.stringify(data));
  }


  if (data.status === 'SUCCESS' || data.status === 'FAILED') {
    app.log.info(`Terminal state reached (${data.status}). Closing socket in 5s...`);

  
    setTimeout(() => {
      if (socket.readyState === 1 || socket.readyState === 0) {
        app.log.info(`✅ Closing socket for order: ${orderId}`);
        socket.close();
      }

      orderEvents.off(orderId, handleUpdate);
    }, 20000);
  }
};

      
      orderEvents.on(String(orderId), handleUpdate);

    
      socket.on('close', () => {
        app.log.info(`🔌 WS disconnected for ${orderId}`);
        orderEvents.off(orderId, handleUpdate);
      });

      socket.on('error', (err) => {
        app.log.error(err, "WebSocket Error");
        orderEvents.off(orderId, handleUpdate);
      });
    }
  );
}