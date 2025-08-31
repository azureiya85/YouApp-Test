'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Message } from '@/models/Messages';
import MessageBubble from '@/components/molecules/MessageBubbles';
import { Send, LoaderCircle } from 'lucide-react';
import { useSession } from '@/context/SessionProvider'; 

export default function ChatPage() {
  const params = useParams();
  const otherUserId = params.userId as string;
  const { user } = useSession(); 
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipientProfile, setRecipientProfile] = useState({ name: 'Loading...', username: '...' });
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

    if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-primary-900 text-white">
        <LoaderCircle className="animate-spin h-8 w-8" />
        <p className="ml-2">Loading session...</p>
      </div>
    );
  }
  
  const MY_USER_ID = user.id; 

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch initial messages and set up WebSocket
  useEffect(() => {
    // 1. Fetch initial chat history
    async function fetchMessages() {
      try {
        const res = await fetch(`/api/viewMessages?with=${otherUserId}`);
        if (res.ok) {
          const { data } = await res.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    }
    fetchMessages();
    
    // Fetch recipient's profile from the company API (you'll need an action/function for this)
    // getProfileById(otherUserId).then(setRecipientProfile);

    // 2. Establish WebSocket connection
    ws.current = new WebSocket(`ws://localhost:8080?userId=${MY_USER_ID}`);

    ws.current.onopen = () => console.log("WebSocket connected");
    ws.current.onclose = () => console.log("WebSocket disconnected");

    ws.current.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data);
      if (type === 'NEW_MESSAGE' && (payload.senderId === otherUserId || payload.senderId === MY_USER_ID)) {
        setMessages((prevMessages) => [...prevMessages, payload]);
      }
    };

    // 3. Cleanup on component unmount
    return () => {
      ws.current?.close();
    };
  }, [otherUserId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await fetch('/api/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId: otherUserId, content: newMessage }),
      });

      if (res.ok) {
        setNewMessage('');
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-primary-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4 flex items-center shadow-md">
        <img
          src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${otherUserId}`} // Placeholder
          alt="Avatar"
          className="h-10 w-10 rounded-full mr-4"
        />
        <div>
          <h1 className="font-bold text-lg">{recipientProfile.name}</h1>
          <p className="text-sm text-gray-400">@{recipientProfile.username}</p>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((msg) => (
          <MessageBubble
                key={msg._id?.toString()}
                message={msg}
                isOwnMessage={msg.senderId === MY_USER_ID} recipientName={''} onReply={function (message: Message): void {
                    throw new Error('Function not implemented.');
                } } onFavorite={function (messageId: string): void {
                    throw new Error('Function not implemented.');
                } } onReact={function (messageId: string, emoji: string): void {
                    throw new Error('Function not implemented.');
                } } onReplyClick={function (messageId: string): void {
                    throw new Error('Function not implemented.');
                } } isSelected={false} onSelect={function (message: Message): void {
                    throw new Error('Function not implemented.');
                } } isEditing={false} onStartEdit={function (message: Message): void {
                    throw new Error('Function not implemented.');
                } } onSaveEdit={function (messageId: string, newContent: string): void {
                    throw new Error('Function not implemented.');
                } } onCancelEdit={function (): void {
                    throw new Error('Function not implemented.');
                } } onDelete={function (messageId: string): void {
                    throw new Error('Function not implemented.');
                } }          />
        ))}
         <div ref={messagesEndRef} />
      </main>

      {/* Message Input */}
      <footer className="p-4 bg-gray-800">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 rounded-full py-2 px-4 focus:outline-none"
          />
          <button type="submit" className="bg-primary-600 rounded-full p-3 hover:bg-primary-500 transition-colors">
            <Send className="h-5 w-5" />
          </button>
        </form>
      </footer>
    </div>
  );
}