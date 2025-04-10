import { useState, useEffect } from 'react';

interface Settings {
  darkTheme: boolean | undefined;
  soundEffects: boolean | undefined;
  sound: boolean;
  notifications: boolean;
  theme: 'light' | 'dark' | 'y2k';
}

const DEFAULT_SETTINGS: Settings = {
  sound: true,
  notifications: true,
  theme: 'light',
  darkTheme: undefined,
  soundEffects: undefined
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    // Save settings to localStorage whenever they change
    localStorage.setItem('settings', JSON.stringify(settings));
    
    // Update theme class on body
    document.body.className = `theme-${settings.theme}`;
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return {
    settings,
    updateSettings,
  };
} 