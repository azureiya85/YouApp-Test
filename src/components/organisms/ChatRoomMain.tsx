'use client';

import { Message } from '@/models/Messages';
import MessageBubble from '@/components/molecules/MessageBubbles';
import DateSeparator from '@/components/molecules/DateSeparator';
import TypingIndicator from '@/components/molecules/TypingIndicator';
import React from 'react';

interface User {
  id: string;
  name: string;
  avatar?: string | null;
}

interface ChatRoomMainProps {
  messages: Message[];
  allMessages: Message[];
  isOtherUserTyping: boolean;
  selectedMessage: Message | null;
  editingMessage: Message | null;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  currentUser: User;
  otherUser: User;
  onSelectedMessageChange: (message: Message | null) => void;
  onReply: (message: Message) => void;
  onFavorite: (messageId: string) => void;
  onReact: (messageId: string, emoji: string) => void;
  onScrollToMessage: (messageId: string) => void;
  onStartEdit: (message: Message) => void;
  onSaveEdit: (messageId: string, newContent: string) => void;
  onCancelEdit: () => void;
  onDelete: (messageId: string) => void;
}

const isSameDay = (d1: Date, d2: Date) => 
  d1.getFullYear() === d2.getFullYear() && 
  d1.getMonth() === d2.getMonth() && 
  d1.getDate() === d2.getDate();

export default function ChatRoomMain({
  messages,
  allMessages,
  isOtherUserTyping,
  selectedMessage,
  editingMessage,
  messagesEndRef,
  currentUser,
  otherUser,
  onSelectedMessageChange,
  onReply,
  onFavorite,
  onReact,
  onScrollToMessage,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}: ChatRoomMainProps) {
  const handleMainClick = () => {
    if (selectedMessage) onSelectedMessageChange(null);
  };

  return (
    <main 
      onClick={handleMainClick} 
      className="flex-1 overflow-y-auto p-4 flex flex-col gap-4"
    >
      {messages.map((msg, index) => {
        const prevMsg = messages[index - 1];
        const showDateSeparator = !prevMsg || !isSameDay(new Date(msg.timestamp), new Date(prevMsg.timestamp));
        const repliedMsg = msg.replyTo ? allMessages.find(m => m._id === msg.replyTo) : null;
        
        return (
          <React.Fragment key={msg._id as string}>
            {showDateSeparator && <DateSeparator date={new Date(msg.timestamp)} />}
            <MessageBubble
              message={msg}
              repliedMessage={repliedMsg}
              isSelected={selectedMessage?._id === msg._id}
              isOwnMessage={msg.senderId === currentUser.id}
              recipientName={otherUser.name}
              recipientAvatar={otherUser.avatar}
              onSelect={onSelectedMessageChange}
              onReply={onReply}
              onFavorite={onFavorite}
              onReact={onReact}
              onReplyClick={onScrollToMessage}
              isEditing={editingMessage?._id === msg._id}
              onStartEdit={onStartEdit}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
              onDelete={onDelete}
            />
          </React.Fragment>
        );
      })}
      {isOtherUserTyping && (
        <TypingIndicator userName={otherUser.name} userAvatar={otherUser.avatar || null} />
      )}
      <div ref={messagesEndRef} />
    </main>
  );
}