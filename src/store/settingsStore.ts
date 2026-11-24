import { create } from 'zustand';
import { AppSettings } from '../types';
import { getSettings, saveSettings } from '../storage/mmkv';
import { DEFAULT_KIND_TARGETS, SPEND_KINDS, sumTargets, type KindTargets } from '../utils/budget';

interface SettingsState {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  loadSettings: () => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  kindTargets: DEFAULT_KIND_TARGETS,
  workingDays: 22,
  currency: 'IDR',
  hariLibur: [0],
};

/** Pakai target tersimpan kalau lengkap & totalnya 100, selain itu bawaan. */
function validTargets(t: Partial<KindTargets> | undefined): KindTargets {
  if (!t || !SPEND_KINDS.every((k) => typeof t[k] === 'number')) return DEFAULT_KIND_TARGETS;
  return sumTargets(t as KindTargets) === 100 ? (t as KindTargets) : DEFAULT_KIND_TARGETS;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,

  loadSettings: () => {
    const saved = getSettings();
    if (saved) {
      // debtRatioLimit lama dilebur ke kindTargets.obligation (satu angka untuk batas cicilan).
      const { debtRatioLimit: _legacy, kindTargets, ...rest } = saved as Partial<AppSettings> & { debtRatioLimit?: number };
      set({ settings: { ...DEFAULT_SETTINGS, ...rest, kindTargets: validTargets(kindTargets) } });
    }
  },

  updateSettings: (partial) => {
    const updated = { ...get().settings, ...partial };
    set({ settings: updated });
    saveSettings(updated);
  },
}));
