'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { LinkPreviewData, Message, Reaction } from '@/models/Messages';
import ChatRoomHeader from '@/components/organisms/ChatRoomHeader';
import ChatRoomMain from '@/components/organisms/ChatRoomMain';
import ChatRoomFooter from '@/components/organisms/ChatRoomFooter';
import FavoritesView from '@/components/molecules/FavoritesView';

const urlRegex = /(https?:\/\/[^\s]+)/g;

const USER_A = { id: 'user_a_123', name: 'You (User A)' };
const USER_B = { id: 'user_b_456', name: 'Ben (User B)', avatar: null };

const MOCK_MESSAGES: Message[] = [
    { _id: '1', senderId: USER_B.id, recipientId: USER_A.id, content: 'Hey! This is a test chat.', timestamp: new Date(Date.now() - 60000 * 5), status: 'read', reactions: [{ emoji: '👋', userIds: [USER_A.id] }] },
    { _id: '2', senderId: USER_A.id, recipientId: USER_B.id, content: 'Looks like it\'s working.', timestamp: new Date(Date.now() - 60000 * 4), status: 'sent', isFavorited: true },
    { _id: '3', senderId: USER_B.id, recipientId: USER_A.id, content: 'Try replying to this message!', timestamp: new Date(Date.now() - 60000 * 3), status: 'sent' },
    { _id: '4', senderId: USER_A.id, recipientId: USER_B.id, content: 'Okay, I will.', timestamp: new Date(Date.now() - 60000 * 2), status: 'sent', replyTo: '3' },
];

// Auto-reply responses
const AUTO_REPLIES = [
  "That's interesting!",
  "I see what you mean.",
  "Thanks for sharing that.",
  "Good point!",
  "Absolutely!",
  "I agree with that.",
  "That makes sense.",
  "Interesting perspective!",
];

export default function ChatRoomTemplate() {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoReplyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- DERIVED STATE & MEMOS ---
  const filteredMessages = useMemo(() => {
    if (!searchTerm) return messages;
    return messages.filter(m => m.content.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [messages, searchTerm]);

  // --- EFFECTS ---
  useEffect(() => { 
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [messages, isOtherUserTyping]);
  
  useEffect(() => {
    if (selectedFile) setPreviewUrl(URL.createObjectURL(selectedFile));
    else setPreviewUrl(null);
  }, [selectedFile]);

  const handleScrollToMessage = (messageId: string) => {
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('bg-primary-600/30', 'transition-all', 'duration-1000');
      setTimeout(() => {
        element.classList.remove('bg-primary-600/30');
      }, 2000);
    }
  };

  const triggerAutoReply = () => {
    // Clear any existing timeout
    if (autoReplyTimeoutRef.current) {
      clearTimeout(autoReplyTimeoutRef.current);
    }

    // Show typing indicator
    setIsOtherUserTyping(true);

    // Send auto-reply after a delay
    autoReplyTimeoutRef.current = setTimeout(() => {
      const randomReply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      const autoReplyMessage: Message = {
        _id: `msg_auto_${Math.random()}`,
        senderId: USER_B.id,
        recipientId: USER_A.id,
        content: randomReply,
        timestamp: new Date(),
        status: 'sent',
      };
      
      setMessages(prev => [...prev, autoReplyMessage]);
      setIsOtherUserTyping(false);
    }, 2000 + Math.random() * 2000); // Random delay between 2-4 seconds
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;

    let linkPreviewData: LinkPreviewData | undefined;
    const urls = newMessage.match(urlRegex);
    if (urls && urls[0].includes('nextjs.org')) {
      linkPreviewData = {
        url: 'https://nextjs.org',
        title: 'Next.js by Vercel - The React Framework',
        description: 'Production grade React applications that scale. The worlds leading companies use Next.js by Vercel to build static and dynamic websites and web applications.',
        image: 'https://nextjs.org/static/twitter-cards/home.jpg',
      };
    }
    
    const userAMessage: Message = {
      _id: `msg_${Math.random()}`,
      senderId: USER_A.id, 
      recipientId: USER_B.id,
      content: newMessage, 
      timestamp: new Date(), 
      status: 'sent',
      ...(replyingTo && { replyTo: replyingTo._id }),
      ...(selectedFile && previewUrl && { attachment: { type: 'image', url: previewUrl } }),
      ...(linkPreviewData && { linkPreview: linkPreviewData }),
    };
    
    setMessages(prev => [...prev, userAMessage]);
    setNewMessage('');
    setReplyingTo(null);
    setSelectedFile(null);

    // Trigger auto-reply from the other user
    triggerAutoReply();
  };
  
  const handleFavorite = (messageId: string) => {
    setMessages(prev => prev.map(m => m._id === messageId ? { ...m, isFavorited: !m.isFavorited } : m));
  };
  
  const handleReact = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(m => {
        if (m._id !== messageId) return m;
        const reactions = m.reactions ? [...m.reactions] : [];
        const existingReaction = reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
            existingReaction.userIds.includes(USER_A.id)
                ? existingReaction.userIds = existingReaction.userIds.filter(id => id !== USER_A.id)
                : existingReaction.userIds.push(USER_A.id);
        } else {
            reactions.push({ emoji, userIds: [USER_A.id] });
        }
        return { ...m, reactions: reactions.filter(r => r.userIds.length > 0) };
    }));
  };

  const handleReplyFromHeader = () => {
    if (selectedMessage) {
      setReplyingTo(selectedMessage);
      setSelectedMessage(null);
    }
  };

  const handleFavoriteFromHeader = () => {
    if (selectedMessage) {
      handleFavorite(selectedMessage._id as string);
      setSelectedMessage(null);
    }
  };

  const handleDelete = (messageId: string) => {
    setMessages(prev => prev.filter(m => m._id !== messageId));
    if (editingMessage?._id === messageId) setEditingMessage(null);
  };
  
  const handleSaveEdit = (messageId: string, newContent: string) => {
    setMessages(prev => prev.map(m => m._id === messageId ? { ...m, content: newContent } : m));
    setEditingMessage(null);
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (autoReplyTimeoutRef.current) {
        clearTimeout(autoReplyTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-primary-900 text-white relative">
      {showFavorites && (
        <FavoritesView 
            messages={messages} 
            onClose={() => setShowFavorites(false)} 
            onFavoriteClick={(id) => {
                setShowFavorites(false);
                setTimeout(() => handleScrollToMessage(id), 100);
            }}
        />
      )}

      <ChatRoomHeader
        user={USER_B}
        isSearchVisible={isSearchVisible}
        searchTerm={searchTerm}
        selectedMessage={selectedMessage}
        showDropdown={showDropdown}
        onSearchVisibilityChange={setIsSearchVisible}
        onSearchTermChange={setSearchTerm}
        onSelectedMessageChange={setSelectedMessage}
        onShowDropdownChange={setShowDropdown}
        onShowFavorites={() => { setShowFavorites(true); setShowDropdown(false); }}
        onReplyFromHeader={handleReplyFromHeader}
        onFavoriteFromHeader={handleFavoriteFromHeader}
        onDeleteFromHeader={() => selectedMessage && handleDelete(selectedMessage._id as string)}
        onEditFromHeader={() => { if (selectedMessage) { setEditingMessage(selectedMessage); setSelectedMessage(null); } }}
        currentUserId={USER_A.id}
      />
      
      <ChatRoomMain
        messages={filteredMessages}
        allMessages={messages}
        isOtherUserTyping={isOtherUserTyping}
        selectedMessage={selectedMessage}
        editingMessage={editingMessage}
        messagesEndRef={messagesEndRef}
        currentUser={USER_A}
        otherUser={USER_B}
        onSelectedMessageChange={setSelectedMessage}
        onReply={setReplyingTo}
        onFavorite={handleFavorite}
        onReact={handleReact}
        onScrollToMessage={handleScrollToMessage}
        onStartEdit={setEditingMessage}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={() => setEditingMessage(null)}
        onDelete={handleDelete}
      />
      
      <ChatRoomFooter
        newMessage={newMessage}
        replyingTo={replyingTo}
        showEmojiPicker={showEmojiPicker}
        selectedFile={selectedFile}
        previewUrl={previewUrl}
        fileInputRef={fileInputRef}
        currentUser={USER_A}
        otherUser={USER_B}
        onNewMessageChange={setNewMessage}
        onReplyingToChange={setReplyingTo}
        onShowEmojiPickerChange={setShowEmojiPicker}
        onSelectedFileChange={setSelectedFile}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}