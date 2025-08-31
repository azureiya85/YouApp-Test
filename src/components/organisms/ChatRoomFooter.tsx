'use client';

import { Message } from '@/models/Messages';
import { Send, Smile, Paperclip, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Theme } from 'emoji-picker-react';

// Dynamically import the Emoji picker to avoid bloating the initial page load
const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

interface User {
  id: string;
  name: string;
  avatar?: string | null;
}

interface ChatRoomFooterProps {
  newMessage: string;
  replyingTo: Message | null;
  showEmojiPicker: boolean;
  selectedFile: File | null;
  previewUrl: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  currentUser: User;
  otherUser: User;
  onNewMessageChange: (message: string) => void;
  onReplyingToChange: (message: Message | null) => void;
  onShowEmojiPickerChange: (show: boolean) => void;
  onSelectedFileChange: (file: File | null) => void;
  onSendMessage: (e: React.FormEvent) => void;
}

export default function ChatRoomFooter({
  newMessage,
  replyingTo,
  showEmojiPicker,
  selectedFile,
  previewUrl,
  fileInputRef,
  currentUser,
  otherUser,
  onNewMessageChange,
  onReplyingToChange,
  onShowEmojiPickerChange,
  onSelectedFileChange,
  onSendMessage,
}: ChatRoomFooterProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage(e);
    }
  };

  const handleEmojiClick = (emojiData: any) => {
    onNewMessageChange(newMessage + emojiData.emoji);
    onShowEmojiPickerChange(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onSelectedFileChange(e.target.files[0]);
    }
  };

  return (
    <footer className="p-4 bg-gray-800 border-t border-gray-700">
      {replyingTo && (
        <div className="bg-black/20 p-2 rounded-t-lg flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-primary-400">
              Replying to {replyingTo.senderId === currentUser.id ? 'yourself' : otherUser.name}
            </p>
            <p className="text-sm text-gray-300 truncate">{replyingTo.content}</p>
          </div>
          <button onClick={() => onReplyingToChange(null)} className="p-1">
            <X size={16}/>
          </button>
        </div>
      )}
      
      {previewUrl && (
        <div className="p-2 flex justify-between items-start">
          <img src={previewUrl} alt="preview" className="h-16 w-16 object-cover rounded-md" />
          <button onClick={() => onSelectedFileChange(null)} className="p-1">
            <X size={16}/>
          </button>
        </div>
      )}
      
      <div className="relative flex items-center gap-2">
        <div className="relative">
          <button 
            onClick={() => onShowEmojiPickerChange(!showEmojiPicker)} 
            className="p-2 hover:bg-gray-700 rounded-full"
          >
            <Smile />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-full mb-2">
              <EmojiPicker 
                onEmojiClick={handleEmojiClick}
                theme={Theme.DARK} 
              />
            </div>
          )}
        </div>
        
        <input
          type="file" 
          ref={fileInputRef} 
          hidden
          onChange={handleFileSelect} 
          accept="image/*"
        />
        <button 
          onClick={() => fileInputRef.current?.click()} 
          className="p-2 hover:bg-gray-700 rounded-full"
        >
          <Paperclip />
        </button>
        
        <input
          type="text" 
          value={newMessage} 
          onChange={(e) => onNewMessageChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 bg-gray-700 rounded-full py-2 px-4 focus:outline-none"
        />
        
        {selectedFile ? (
          <button 
            disabled 
            className="bg-gray-500 text-white font-bold rounded-full py-2 px-4 cursor-not-allowed"
          >
            Upload Not Implemented
          </button>
        ) : (
          <button 
            type="submit" 
            onClick={onSendMessage} 
            className="bg-primary-600 rounded-full p-3 hover:bg-primary-500 transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        )}
      </div>
    </footer>
  );
}