'use client';

import * as Popover from '@radix-ui/react-popover';
import { Smile } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Theme } from 'emoji-picker-react';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

type EmojiReactionPopoverProps = {
  onEmojiSelect: (emoji: string) => void;
};

export default function EmojiReactionPopover({ onEmojiSelect }: EmojiReactionPopoverProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="p-1 hover:bg-gray-700 rounded-full" aria-label="Add reaction">
          <Smile size={16} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content sideOffset={5} className="z-50">
          <EmojiPicker
            onEmojiClick={(emojiData) => onEmojiSelect(emojiData.emoji)}
            theme={Theme.DARK}
            height={350}
            width={300}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}