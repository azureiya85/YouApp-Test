import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { getSession } from '@/lib/authUtils'; 
import { getRabbitMQChannel, CHAT_EXCHANGE } from '@/lib/rabbitmq';
import { Message } from '@/models/Messages';

export async function GET(req: NextRequest) {
  // 1. Authenticate the user using our session helper
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const currentUserId = session.user.id;

  try {
    const { searchParams } = new URL(req.url);
    const otherUserId = searchParams.get('with');

    if (!otherUserId) {
      return NextResponse.json({ message: '`with` query parameter is required' }, { status: 400 });
    }

    const db = await dbConnect();
    const messagesCollection = db.collection<Message>('messages');

    // 2. Fetch the conversation history
    const messages = await messagesCollection.find({
      $or: [
        { senderId: currentUserId, recipientId: otherUserId },
        { senderId: otherUserId, recipientId: currentUserId },
      ],
    }).sort({ timestamp: 1 }).toArray();

    // 3. Mark received messages as 'read'
    const updateResult = await messagesCollection.updateMany(
      { senderId: otherUserId, recipientId: currentUserId, status: 'sent' },
      { $set: { status: 'read' } }
    );

    // 4. If any messages were updated to 'read', notify the original sender
    if (updateResult.modifiedCount > 0) {
      try {
        const channel = await getRabbitMQChannel();
        const routingKey = `notifications.${otherUserId}`; // Notify the *other* user
        
        // Find which message IDs were just updated to be sent in the payload
        const updatedMessageIds = messages
          .filter(m => m.senderId === otherUserId && m.status === 'sent')
          .map(m => m._id);

        const notificationPayload = JSON.stringify({
          type: 'MESSAGES_READ',
          payload: {
            readerId: currentUserId,
            messageIds: updatedMessageIds,
          },
        });
        
        channel.publish(CHAT_EXCHANGE, routingKey, Buffer.from(notificationPayload), {
          persistent: true,
        });

      } catch (rabbitError) {
        console.error('RabbitMQ: Failed to publish read receipt:', rabbitError);
      }
    }

    return NextResponse.json({ data: messages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}