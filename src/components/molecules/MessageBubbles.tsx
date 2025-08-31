'use client';

import { Message } from '@/models/Messages';
import { cn } from '@/lib/utils';
import { Check, CheckCheck, Circle, CornerDownRight, Edit, Smile, Star, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import Avatar from './Avatar'; 
import EmojiReactionPopover from './EmojiReactionPopover'; 
import { useLongPress } from '@/hooks/useLongPress'; 
import React from 'react';
import LinkPreview from './LinkPreview';

type MessageBubbleProps = {
  message: Message;
  repliedMessage?: Message | null;
  isSelected: boolean; 
  isOwnMessage: boolean;
  recipientName: string;
  recipientAvatar?: string | null;
  isEditing: boolean;
  onSelect: (message: Message) => void; 
  onReply: (message: Message) => void;
  onFavorite: (messageId: string) => void;
  onReact: (messageId: string, emoji: string) => void;
  onReplyClick: (messageId: string) => void;
  onStartEdit: (message: Message) => void;
  onSaveEdit: (messageId: string, newContent: string) => void;
  onCancelEdit: () => void;
  onDelete: (messageId: string) => void;
};

const StatusIcon = ({ status }: { status: Message['status'] }) => {
  if (status === 'read') return <CheckCheck className="h-4 w-4 text-blue-400" />;
  if (status === 'sent') return <Check className="h-4 w-4 text-gray-400" />;
  if (status === 'sending' || status === 'failed') return <Circle className="h-4 w-4 text-gray-500" />;
  return null;
};

export default function MessageBubble({
  message,
  repliedMessage,
  isSelected,
  isOwnMessage,
  recipientName,
  recipientAvatar,
  isEditing,
  onSelect,
  onReply,
  onFavorite,
  onReact,
  onReplyClick,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}: MessageBubbleProps) {
   const [editText, setEditText] = React.useState(message.content);
   const bubbleId = `message-${message._id}`;
  
  // Setup long press event handlers
  const longPressEvents = useLongPress(() => onSelect(message));

   const handleSave = () => {
    if (editText.trim()) {
      onSaveEdit(message._id as string, editText);
    }
  };

  return (
    <div
      id={bubbleId}
      className={cn(
        'flex items-end gap-2 max-w-[75%] group relative transition-colors',
        isOwnMessage ? 'self-end flex-row-reverse' : 'self-start',
        isSelected && 'bg-primary-600/30 rounded-lg' 
      )}
      {...longPressEvents}
    >
      {!isOwnMessage && (
        <Avatar name={recipientName} src={recipientAvatar} className="h-8 w-8 self-end" />
      )}
      
      <div className={cn(
          "absolute top-[-16px] z-10 hidden md:group-hover:flex items-center gap-1 bg-gray-800 border border-gray-600 rounded-full p-1",
          isOwnMessage ? "left-[-8px]" : "right-[-8px]"
      )}>
        {isOwnMessage && <button onClick={() => onStartEdit(message)} className="p-1 hover:bg-gray-700 rounded-full"><Edit size={16} /></button>}
        {isOwnMessage && <button onClick={() => onDelete(message._id as string)} className="p-1 hover:bg-gray-700 rounded-full"><Trash2 size={16} /></button>}
        <button onClick={() => onReply(message)} className="p-1 hover:bg-gray-700 rounded-full"><CornerDownRight size={16} /></button>
        <button onClick={() => onFavorite(message._id as string)} className="p-1 hover:bg-gray-700 rounded-full">
            <Star size={16} className={message.isFavorited ? "fill-yellow-400 text-yellow-400" : ""}/>
        </button>
        <EmojiReactionPopover onEmojiSelect={(emoji) => onReact(message._id as string, emoji)} />
      </div>

      <div
        className={cn(
          'p-3 rounded-lg flex flex-col',
          isOwnMessage ? 'bg-primary-700 rounded-br-none' : 'bg-gray-700 rounded-bl-none'
        )}
      >
        {/* Render Reply Preview */}
        {repliedMessage && (
            <a 
                href={`#message-${repliedMessage._id}`}
                onClick={(e) => { e.preventDefault(); onReplyClick(repliedMessage._id as string)}}
                className="mb-2 p-2 bg-black/20 rounded-md border-l-2 border-primary-400 cursor-pointer block"
            >
                <p className="font-bold text-xs text-primary-300">{repliedMessage.senderId === 'user_a_123' ? 'You' : recipientName}</p>
                <p className="text-xs text-gray-300 truncate">{repliedMessage.content}</p>
            </a>
        )}

        {/* Render Attachment */}
        {message.attachment?.type === 'image' && (
            <img src={message.attachment.url} alt="attachment" className="rounded-lg mb-2 max-w-xs" />
        )}
        
        {isEditing ? (
          // --- EDITING VIEW ---
          <div className="flex flex-col gap-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full bg-black/30 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-400"
              rows={3}
              autoFocus
            />
            <div className="flex justify-end gap-2 text-xs">
              <button onClick={onCancelEdit} className="hover:underline">Cancel</button>
              <button onClick={handleSave} className="bg-primary-600 px-3 py-1 rounded-md hover:bg-primary-500">Save</button>
            </div>
          </div>
        ) : (
          // --- NORMAL VIEW ---
          <>
            <p className="text-white text-sm whitespace-pre-wrap">{message.content}</p>
            {message.linkPreview && <LinkPreview data={message.linkPreview} />}
          </>
        )}

        {/* Render Reactions */}
        {message.reactions && message.reactions.length > 0 && (
            <div className="flex gap-1 mt-1">
                {message.reactions.map(r => (
                    <div key={r.emoji} className="bg-black/30 rounded-full px-2 py-0.5 text-xs flex items-center gap-1">
                        <span>{r.emoji}</span>
                        <span className="font-semibold">{r.userIds.length}</span>
                    </div>
                ))}
            </div>
        )}

        {/* Timestamp and Status */}
        <div className="flex items-center gap-1.5 self-end mt-1">
          <span className="text-xs text-gray-400">
            {format(new Date(message.timestamp), 'HH:mm')}
          </span>
          {isOwnMessage && <StatusIcon status={message.status} />}
        </div>
      </div>
    </div>
  );
}