import Avatar from './Avatar';

type TypingIndicatorProps = {
  userName: string;
  userAvatar: string | null;
};

export default function TypingIndicator({ userName, userAvatar }: TypingIndicatorProps) {
  return (
    <div className="flex items-end gap-2 p-4">
      <Avatar name={userName} src={userAvatar} className="h-8 w-8" />
      <div className="p-3 bg-gray-700 rounded-lg flex items-center gap-1">
        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
      </div>
    </div>
  );
}