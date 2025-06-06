import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function calculateHappinessDecay(lastFed: Date) {
  const hoursSinceLastFed = (Date.now() - lastFed.getTime()) / (1000 * 60 * 60);
  return Math.max(0, 100 - hoursSinceLastFed * 5);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
}

export const CHIBI_IMAGES = {
  fox: '/images/fox.png',
  panda: '/images/panda.png',
  purplebunny: '/images/purplebunny.png',
  redcat: '/images/redcat.png',
  yellowdog: '/images/yellowdog-full.png'
} as const;

export type ChibiType = keyof typeof CHIBI_IMAGES;
