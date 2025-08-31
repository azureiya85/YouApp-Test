type DateSeparatorProps = {
  date: Date;
};

const formatDate = (date: Date) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function DateSeparator({ date }: DateSeparatorProps) {
  return (
    <div className="relative my-4 flex justify-center">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-gray-700"></span>
      </div>
      <span className="relative bg-primary-900 px-3 text-xs font-medium text-gray-400">
        {formatDate(date)}
      </span>
    </div>
  );
}