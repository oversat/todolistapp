import { useState, useCallback } from 'react';

interface EmojiPosition {
  id: string;
  emoji: string;
  left: number;
  top: number;
}

const EMOJIS = ['🍎', '🍕', '🍦', '🍩', '🍪', '❤️', '✨'];

export function useEmojiEffect() {
  const [emojis, setEmojis] = useState<EmojiPosition[]>([]);

  const showEmojis = useCallback((targetElement: HTMLElement) => {
    const rect = targetElement.getBoundingClientRect();
    const newEmojis: EmojiPosition[] = [];

    for (let i = 0; i < 8; i++) {
      const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      newEmojis.push({
        id: `${Date.now()}-${i}`,
        emoji,
        left: rect.left + Math.random() * rect.width,
        top: rect.top + rect.height / 2,
      });
    }

    setEmojis(prev => [...prev, ...newEmojis]);

    // Remove emojis after animation
    setTimeout(() => {
      setEmojis(prev => prev.filter(e => !newEmojis.find(ne => ne.id === e.id)));
    }, 2000);
  }, []);

  return {
    emojis,
    showEmojis,
  };
} 