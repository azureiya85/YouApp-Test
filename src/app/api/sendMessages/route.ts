import { NextRequest, NextResponse } from 'next/server';
import { getRabbitMQChannel, CHAT_EXCHANGE } from '@/lib/rabbitmq';
import dbConnect from '@/lib/dbConnect';
import { Message } from '@/models/Messages';
import { getSession } from '@/lib/authUtils'; 

export async function POST(req: NextRequest) {
  const session = await getSession(); 
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const senderId = session.user.id; 

  try {
    const { recipientId, content } = await req.json();

    if (!recipientId || !content) {
      return NextResponse.json({ message: 'Recipient and content are required' }, { status: 400 });
    }

    // 1. Save to MongoDB
    const db = await dbConnect();
    const newMessage: Omit<Message, '_id'> = {
      senderId,
      recipientId,
      content,
      timestamp: new Date(),
      status: 'sent',
    };
    const result = await db.collection<Message>('messages').insertOne(newMessage as Message);
    const savedMessage = { ...newMessage, _id: result.insertedId };

    // 2. Publish to RabbitMQ
    const channel = await getRabbitMQChannel();
    const routingKey = `notifications.${recipientId}`;
    const messagePayload = JSON.stringify(savedMessage);
    channel.publish(CHAT_EXCHANGE, routingKey, Buffer.from(messagePayload), { persistent: true });

    return NextResponse.json({ message: 'Message sent successfully', data: savedMessage }, { status: 201 });

  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}