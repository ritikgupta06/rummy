import { create } from 'zustand';
import type { AppSettings } from '@/src/types';

interface SettingsStore extends AppSettings {
  setDarkMode: (value: boolean) => void;
  setNotifications: (value: boolean) => void;
  setSound: (value: boolean) => void;
  setMusic: (value: boolean) => void;
  setHaptics: (value: boolean) => void;
  toggle: (key: keyof AppSettings) => void;
  reset: () => void;
}

const defaultSettings: AppSettings = {
  darkMode: true,
  notifications: true,
  sound: true,
  music: true,
  haptics: true,
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  ...defaultSettings,

  setDarkMode: (value) => set({ darkMode: value }),
  setNotifications: (value) => set({ notifications: value }),
  setSound: (value) => set({ sound: value }),
  setMusic: (value) => set({ music: value }),
  setHaptics: (value) => set({ haptics: value }),

  toggle: (key) => set((state) => ({ [key]: !state[key] } as Partial<AppSettings>)),

  reset: () => set(defaultSettings),
}));
