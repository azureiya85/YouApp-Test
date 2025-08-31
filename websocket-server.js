const { WebSocketServer } = require('ws');
const amqp = require('amqplib');
require('dotenv').config(); 

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const CHAT_EXCHANGE = 'chat_exchange';
const NOTIFICATION_QUEUE = 'notification_queue';

const clients = new Map();

async function startServer() {
  // 1. Start WebSocket Server
  const wss = new WebSocketServer({ port: 8080 });
  console.log('WebSocket server started on port 8080');

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      console.warn('Connection attempt without userId. Closing.');
      ws.close();
      return;
    }

    console.log(`Client connected: ${userId}`);
    clients.set(userId, ws);

    ws.on('close', () => {
      console.log(`Client disconnected: ${userId}`);
      clients.delete(userId);
    });

    ws.on('error', (error) => {
        console.error(`WebSocket error for user ${userId}:`, error);
    });
  });

  // 2. Connect to RabbitMQ and consume messages
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange(CHAT_EXCHANGE, 'direct', { durable: true });
    
    const q = await channel.assertQueue(NOTIFICATION_QUEUE, { durable: true });
    console.log(`[*] Waiting for messages in queue: ${q.queue}. To exit press CTRL+C`);

    await channel.bindQueue(q.queue, CHAT_EXCHANGE, 'notifications.*');

    channel.consume(q.queue, (msg) => {
      if (msg !== null) {
        try {
            const messageData = JSON.parse(msg.content.toString());
            const { recipientId } = messageData;

            console.log(`[x] Received message for recipient: ${recipientId}`);

            const recipientSocket = clients.get(recipientId);
            if (recipientSocket && recipientSocket.readyState === recipientSocket.OPEN) {
                console.log(`[->] Forwarding message to client: ${recipientId}`);
                recipientSocket.send(JSON.stringify({ type: 'NEW_MESSAGE', payload: messageData }));
            } else {
                console.log(`[!] Recipient ${recipientId} is not connected.`);
            }

            channel.ack(msg);
        } catch (e) {
            console.error("Error processing message from queue:", e);
            channel.nack(msg, false, false);
        }
      }
    });

  } catch (err) {
    console.error('Failed to connect to RabbitMQ or start consuming:', err);
    process.exit(1);
  }
}

startServer();