import { create } from 'zustand';
import { AppSettings } from '../types';
import { getSettings, saveSettings } from '../storage/mmkv';

interface SettingsState {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  loadSettings: () => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  debtRatioLimit: 30,
  workingDays: 22,
  currency: 'IDR',
  hariLibur: [0],
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,

  loadSettings: () => {
    const saved = getSettings();
    if (saved) {
      set({ settings: { ...DEFAULT_SETTINGS, ...saved } });
    }
  },

  updateSettings: (partial) => {
    const updated = { ...get().settings, ...partial };
    set({ settings: updated });
    saveSettings(updated);
  },
}));
