import { useRef, useCallback } from 'react';

export function useLongPress(
  callback: () => void,
  { delay = 300 } = {}
) {
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  const start = useCallback(() => {
    isLongPress.current = false;
    timeout.current = setTimeout(() => {
      isLongPress.current = true;
      callback();
    }, delay);
  }, [callback, delay]);

  const clear = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
  }, []);

  return {
    onMouseDown: () => start(),
    onTouchStart: () => start(),
    onMouseUp: () => clear(),
    onMouseLeave: () => clear(),
    onTouchEnd: () => clear(),
  };
}