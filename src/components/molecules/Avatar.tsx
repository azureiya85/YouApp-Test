import { cn } from '@/lib/utils'; 

type AvatarProps = {
  src?: string | null;
  name: string;
  className?: string;
};

const getColorFromName = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-amber-500',
    'bg-yellow-500', 'bg-lime-500', 'bg-green-500',
    'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500',
    'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
    'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500',
    'bg-pink-500', 'bg-rose-500',
  ];
  const index = Math.abs(hash % colors.length);
  return colors[index];
};

export default function Avatar({ src, name, className }: AvatarProps) {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const colorClass = getColorFromName(name || '');

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('h-10 w-10 rounded-full object-cover', className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'h-10 w-10 rounded-full flex items-center justify-center font-bold text-white',
        colorClass,
        className
      )}
    >
      {initial}
    </div>
  );
}