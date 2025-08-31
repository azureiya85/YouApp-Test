import { Message } from "@/models/Messages";
import { ArrowLeft } from "lucide-react";

type FavoritesViewProps = {
  messages: Message[];
  onClose: () => void;
  onFavoriteClick: (messageId: string) => void;
};

export default function FavoritesView({ messages, onClose, onFavoriteClick }: FavoritesViewProps) {
  const favoritedMessages = messages.filter(m => m.isFavorited);
  
  return (
    <div className="absolute inset-0 bg-primary-900 z-30 flex flex-col">
      <header className="bg-gray-800 p-4 flex items-center gap-4 shadow-md">
        <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full"><ArrowLeft size={20}/></button>
        <h2 className="font-bold text-lg">Favorite Messages</h2>
      </header>
      <div className="flex-1 overflow-y-auto p-4">
        {favoritedMessages.length > 0 ? (
          favoritedMessages.map(msg => (
             <div key={msg._id as string} onClick={() => onFavoriteClick(msg._id as string)} className="p-3 mb-2 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700">
                <p className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleString()}</p>
                <p>{msg.content}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No favorite messages yet.</p>
        )}
      </div>
    </div>
  );
}