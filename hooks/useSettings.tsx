// ElderGuard AI - Settings Context & Hook

'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { AppSettings } from '@/types';

const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  textSize: 'large',
  highContrast: false,
  voiceAlerts: true,
  autoEnd: true,
  riskThreshold: 80,
  simpleMode: false,
};

const SettingsContext = createContext<{
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
}>({
  settings: DEFAULT_SETTINGS,
  updateSetting: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('elderguard-settings');
      if (stored) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
    } catch {}
  }, []);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      try { localStorage.setItem('elderguard-settings', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
