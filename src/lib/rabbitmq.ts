import * as amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL;
if (!RABBITMQ_URL) throw new Error('Please define the RABBITMQ_URL environment variable');

let connectionPromise: Promise<amqp.Connection | amqp.Channel> | null = null;
export const CHAT_EXCHANGE = 'chat_exchange';

async function connectToRabbitMQ(): Promise<amqp.Connection | amqp.Channel> {
  if (connectionPromise) return connectionPromise;

  const createConnection = async (): Promise<amqp.Connection | amqp.Channel> => {
    try {
      const connOrChan = await amqp.connect(RABBITMQ_URL as string);
      console.log('Successfully connected to RabbitMQ.');

      if ('on' in connOrChan && typeof (connOrChan as any).on === 'function') {
        (connOrChan as any).on('error', (err: any) => {
          console.error('[AMQP] connection error', err);
          connectionPromise = null;
        });
        (connOrChan as any).on('close', () => {
          console.warn('[AMQP] connection closed');
          connectionPromise = null;
        });
      }

      return connOrChan as unknown as amqp.Connection | amqp.Channel;
    } catch (err) {
      console.error('[AMQP] failed to connect', err);
      connectionPromise = null;
      throw err;
    }
  };

  connectionPromise = createConnection();
  return connectionPromise;
}

export async function getRabbitMQChannel(): Promise<amqp.Channel> {
  const connOrChan = await connectToRabbitMQ();

  if ('createChannel' in connOrChan && typeof (connOrChan as any).createChannel === 'function') {
    const connection = connOrChan as amqp.Connection;
    const channel = await connection.createChannel();
    await channel.assertExchange(CHAT_EXCHANGE, 'direct', { durable: true });
    return channel;
  }

  const channel = connOrChan as amqp.Channel;
  await channel.assertExchange(CHAT_EXCHANGE, 'direct', { durable: true });
  return channel;
}
