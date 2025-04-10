import { useSettings } from './useSettings';
import { useEffect } from 'react';

export function useTheme() {
  const { settings } = useSettings();

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'y2k') {
      root.classList.add('y2k-theme');
    } else {
      root.classList.remove('y2k-theme');
    }
  }, [settings.theme]);

  return settings.theme;
} 