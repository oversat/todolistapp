import { useState, useCallback } from 'react';

interface Emoji {
  id: string;
  emoji: string;
  left: number;
  top: number;
}

export function useEmojiEffect() {
  const [emojis, setEmojis] = useState<Emoji[]>([]);

  const showEmojis = useCallback((element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const newEmojis: Emoji[] = [];
    
    // Generate 3 random emojis
    const emojiList = ['🌟', '✨', '💫', '⭐', '🎉', '🎊'];
    for (let i = 0; i < 3; i++) {
      const emoji = emojiList[Math.floor(Math.random() * emojiList.length)];
      const left = rect.left + (rect.width / 2) + (Math.random() - 0.5) * 100;
      const top = rect.top + (rect.height / 2) + (Math.random() - 0.5) * 100;
      
      newEmojis.push({
        id: Math.random().toString(36).substr(2, 9),
        emoji,
        left,
        top,
      });
    }

    setEmojis(prev => [...prev, ...newEmojis]);

    // Remove emojis after animation completes
    setTimeout(() => {
      setEmojis(prev => prev.filter(e => !newEmojis.some(ne => ne.id === e.id)));
    }, 2000);
  }, []);

  return {
    emojis,
    showEmojis,
  };
} 