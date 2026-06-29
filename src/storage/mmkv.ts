import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({
  id: 'dompetku-storage',
});

export const StorageKeys = {
  SETTINGS: 'app_settings',
  ONBOARDING_DONE: 'onboarding_done',
} as const;

export function getSettings() {
  const raw = storage.getString(StorageKeys.SETTINGS);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSettings(settings: object) {
  storage.set(StorageKeys.SETTINGS, JSON.stringify(settings));
}
