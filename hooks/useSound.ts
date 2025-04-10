import { useRef, useEffect } from 'react';
import { useSettings } from './useSettings';

const SOUNDS = {
  complete: '/sounds/complete.mp3',
  delete: '/sounds/delete.mp3',
  feed: '/sounds/feed.mp3',
  clean: '/sounds/clean.mp3',
  error: '/sounds/error.mp3',
};

export function useSound() {
  const { settings } = useSettings();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
  }, []);

  const playSound = (sound: keyof typeof SOUNDS) => {
    if (!settings.soundEffects || !audioRef.current) return;

    audioRef.current.src = SOUNDS[sound];
    audioRef.current.play().catch(error => {
      console.error('Error playing sound:', error);
    });
  };

  return {
    playSound,
  };
} 