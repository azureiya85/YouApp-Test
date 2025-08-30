import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

type EditIconButtonProps = {
  onClick: () => void;
};

export default function EditIconButton({ onClick }: EditIconButtonProps) {
  return (
    <Button onClick={onClick} variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
      <Pencil className="h-4 w-4" />
    </Button>
  );
}