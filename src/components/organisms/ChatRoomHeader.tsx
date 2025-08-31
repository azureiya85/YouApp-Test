'use client';

import { Message } from '@/models/Messages';
import Avatar from '@/components/molecules/Avatar';
import ProfileDropdown from '@/components/molecules/ProfileDropDown';
import { Search, X, Edit, Trash2, CornerDownRight, Star } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  avatar?: string | null;
}

interface ChatRoomHeaderProps {
  user: User;
  isSearchVisible: boolean;
  searchTerm: string;
  selectedMessage: Message | null;
  showDropdown: boolean;
  currentUserId: string;
  onSearchVisibilityChange: (visible: boolean) => void;
  onSearchTermChange: (term: string) => void;
  onSelectedMessageChange: (message: Message | null) => void;
  onShowDropdownChange: (show: boolean) => void;
  onShowFavorites: () => void;
  onReplyFromHeader: () => void;
  onFavoriteFromHeader: () => void;
  onDeleteFromHeader: () => void;
  onEditFromHeader: () => void;
}

export default function ChatRoomHeader({
  user,
  isSearchVisible,
  searchTerm,
  selectedMessage,
  showDropdown,
  currentUserId,
  onSearchVisibilityChange,
  onSearchTermChange,
  onSelectedMessageChange,
  onShowDropdownChange,
  onShowFavorites,
  onReplyFromHeader,
  onFavoriteFromHeader,
  onDeleteFromHeader,
  onEditFromHeader,
}: ChatRoomHeaderProps) {
  const handleSearchClose = () => {
    onSearchVisibilityChange(false);
    onSearchTermChange('');
  };

  const renderSearchHeader = () => (
    <div className="w-full flex items-center gap-2">
      <Search size={22} className="text-gray-400"/>
      <input 
        type="text" 
        placeholder="Search messages..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        className="flex-1 bg-transparent focus:outline-none"
        autoFocus
      />
      <button onClick={handleSearchClose}>
        <X size={24} />
      </button>
    </div>
  );

  const renderActionHeader = () => (
    <>
      <button onClick={() => onSelectedMessageChange(null)}>
        <X size={24} />
      </button>
      <div className="flex items-center gap-2">
        {selectedMessage?.senderId === currentUserId && (
          <button onClick={onEditFromHeader}>
            <Edit size={22} />
          </button>
        )}
        {selectedMessage?.senderId === currentUserId && (
          <button onClick={onDeleteFromHeader}>
            <Trash2 size={22} />
          </button>
        )}
        <button onClick={onReplyFromHeader} className="p-2 hover:bg-gray-700 rounded-full">
          <CornerDownRight size={22} />
        </button>
        <button onClick={onFavoriteFromHeader} className="p-2 hover:bg-gray-700 rounded-full">
          <Star size={22} className={selectedMessage?.isFavorited ? "fill-yellow-400 text-yellow-400" : ""}/>
        </button>
      </div>
    </>
  );

  const renderDefaultHeader = () => (
    <>
      <div className="relative flex items-center gap-4">
        <button 
          onClick={() => onShowDropdownChange(!showDropdown)} 
          className="flex items-center gap-4 cursor-pointer"
        >
          <Avatar name={user.name} src={user.avatar} />
          <div>
            <h1 className="font-bold text-lg">{user.name}</h1>
            <p className="text-sm text-gray-400">@ben_tester</p>
          </div>
        </button>
        {showDropdown && (
          <ProfileDropdown onShowFavorites={onShowFavorites} />
        )}
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onSearchVisibilityChange(true)} 
          className="p-2 hover:bg-gray-700 rounded-full"
        >
          <Search size={20}/>
        </button>
        <Link href="/dashboard" className="text-sm text-primary-400 hover:underline">
          Back
        </Link>
      </div>
    </>
  );

  return (
    <header className="bg-gray-800 p-4 flex items-center justify-between shadow-md transition-all">
      {isSearchVisible ? renderSearchHeader() : 
       selectedMessage ? renderActionHeader() : 
       renderDefaultHeader()}
    </header>
  );
}