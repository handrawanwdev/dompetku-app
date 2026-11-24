import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { createMMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import { sha256 } from '../utils/sha256';

// Kunci aplikasi (opsional). PIN tidak pernah disimpan mentah: yang disimpan
// hash bergaram di SecureStore (Android Keystore / iOS Keychain). Aktif = ada hash.
// Preferensi & hitungan salah PIN di MMKV terpisah.

export const PIN_LENGTH = 6;
const PIN_KEY = 'dompetku_app_pin';
const ROUNDS = 500;
const store = createMMKV({ id: 'dompetku-lock' });

const K = {
  biometric: 'biometric',
  relockAfter: 'relock_after',
  failures: 'failures',
  lockUntil: 'lock_until',
} as const;

/** Detik di latar belakang sebelum app terkunci lagi. */
export const RELOCK_OPTIONS = [
  { seconds: 0, label: 'Langsung' },
  { seconds: 30, label: '30 detik' },
  { seconds: 60, label: '1 menit' },
  { seconds: 300, label: '5 menit' },
];
const DEFAULT_RELOCK = 60;

// ─── PIN ─────────────────────────────────────────────────────────────────────

function hashPin(pin: string, salt: string): string {
  let h = sha256(salt + pin);
  for (let i = 1; i < ROUNDS; i++) h = sha256(salt + h);
  return h;
}

function randomSalt(): string {
  let s = '';
  for (let i = 0; i < 32; i++) s += Math.floor(Math.random() * 16).toString(16);
  return s;
}

/** Kunci aktif = ada PIN tersimpan. Sinkron supaya layar kunci muncul tanpa kedip. */
export function hasPin(): boolean {
  try {
    return Boolean(SecureStore.getItem(PIN_KEY));
  } catch {
    return false;
  }
}

export async function setPin(pin: string): Promise<void> {
  const salt = randomSalt();
  await SecureStore.setItemAsync(PIN_KEY, JSON.stringify({ salt, hash: hashPin(pin, salt) }));
  resetFailures();
}

export async function clearPin(): Promise<void> {
  await SecureStore.deleteItemAsync(PIN_KEY);
  store.remove(K.biometric);
  resetFailures();
}

export type VerifyResult = { ok: true } | { ok: false; attemptsLeft: number; lockedMs: number };

/** Cek PIN + hitung salah. Terlalu sering salah = dikunci sementara, makin lama. */
export async function verifyPin(pin: string): Promise<VerifyResult> {
  const wait = lockoutRemaining();
  if (wait > 0) return { ok: false, attemptsLeft: 0, lockedMs: wait };
  let saved: { salt: string; hash: string } | null = null;
  try {
    const raw = await SecureStore.getItemAsync(PIN_KEY);
    saved = raw ? JSON.parse(raw) : null;
  } catch {
    saved = null;
  }
  if (saved && hashPin(pin, saved.salt) === saved.hash) {
    resetFailures();
    return { ok: true };
  }
  const failures = (store.getNumber(K.failures) ?? 0) + 1;
  store.set(K.failures, failures);
  const lockMs = failures >= 10 ? 30 * 60_000 : failures >= 8 ? 5 * 60_000 : failures >= 5 ? 30_000 : 0;
  if (lockMs) store.set(K.lockUntil, Date.now() + lockMs);
  const nextStep = failures < 5 ? 5 : failures < 8 ? 8 : 10;
  return { ok: false, attemptsLeft: lockMs ? 0 : Math.max(nextStep - failures, 0), lockedMs: lockMs };
}

export function lockoutRemaining(): number {
  const until = store.getNumber(K.lockUntil) ?? 0;
  return Math.max(until - Date.now(), 0);
}

function resetFailures() {
  store.remove(K.failures);
  store.remove(K.lockUntil);
}

// ─── Preferensi ──────────────────────────────────────────────────────────────

export function getBiometricEnabled(): boolean {
  return store.getBoolean(K.biometric) ?? false;
}

export function setBiometricEnabled(v: boolean) {
  store.set(K.biometric, v);
}

export function getRelockAfter(): number {
  return store.getNumber(K.relockAfter) ?? DEFAULT_RELOCK;
}

export function setRelockAfter(seconds: number) {
  store.set(K.relockAfter, seconds);
}

// ─── Biometrik & kunci layar HP ──────────────────────────────────────────────

export interface DeviceAuthInfo {
  /** Sidik jari/wajah terpasang dan terdaftar. */
  biometric: boolean;
  /** HP punya kunci layar (PIN/pola/biometrik), cukup untuk verifikasi pemilik. */
  deviceCredential: boolean;
  /** Nama untuk teks: "sidik jari", "wajah", atau "biometrik". */
  label: string;
}

export async function getDeviceAuthInfo(): Promise<DeviceAuthInfo> {
  try {
    const [hardware, enrolled, level, types] = await Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
      LocalAuthentication.getEnrolledLevelAsync(),
      LocalAuthentication.supportedAuthenticationTypesAsync(),
    ]);
    const T = LocalAuthentication.AuthenticationType;
    const label =
      types.includes(T.FINGERPRINT) && types.length === 1
        ? 'sidik jari'
        : types.includes(T.FACIAL_RECOGNITION) && types.length === 1
          ? 'wajah'
          : 'sidik jari/wajah';
    return {
      biometric: hardware && enrolled,
      deviceCredential: level >= LocalAuthentication.SecurityLevel.SECRET,
      label,
    };
  } catch {
    return { biometric: false, deviceCredential: false, label: 'sidik jari/wajah' };
  }
}

/** Buka kunci pakai biometrik saja (gagal = kembali ke PIN Dompetku). */
export async function authenticateBiometric(promptMessage: string): Promise<boolean> {
  pauseAutoLock();
  try {
    const r = await LocalAuthentication.authenticateAsync({
      promptMessage,
      cancelLabel: 'Pakai PIN',
      disableDeviceFallback: true,
    });
    return r.success;
  } catch {
    return false;
  }
}

/** Verifikasi pemilik HP (biometrik atau PIN/pola layar HP) untuk reset PIN. */
export async function verifyDeviceOwner(promptMessage: string): Promise<boolean> {
  pauseAutoLock();
  try {
    const r = await LocalAuthentication.authenticateAsync({ promptMessage, cancelLabel: 'Batal' });
    return r.success;
  } catch {
    return false;
  }
}

// ─── Status kunci (dipakai AppLockGate) ──────────────────────────────────────

let pauseUntil = 0;

/**
 * Jangan kunci ulang untuk kepergian singkat yang disengaja (pilih file, bagikan,
 * dialog izin, prompt biometrik). Panggil tepat sebelum membuka layar sistem.
 */
export function pauseAutoLock(ms = 2 * 60_000) {
  pauseUntil = Date.now() + ms;
}

/** True kalau kepergian barusan disengaja. Sekali pakai: jeda langsung habis. */
export function consumeAutoLockPause(): boolean {
  const paused = Date.now() < pauseUntil;
  pauseUntil = 0;
  return paused;
}

export const useAppLock = create<{ locked: boolean; lock: () => void; unlock: () => void }>((set) => ({
  locked: hasPin(),
  lock: () => set({ locked: hasPin() }),
  unlock: () => set({ locked: false }),
}));
