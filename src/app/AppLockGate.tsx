import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AppState, BackHandler, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRealm } from '@realm/react';

import { COLORS, FONTS, SPACING } from '../theme';
import { Text } from '../components/common/Text';
import { PinPad } from '../components/lock/PinPad';
import { ProfileAvatar } from '../modules/settings/components/ProfileAvatar';
import { useSettingsStore } from '../store/settingsStore';
import { ensureDefaultExpenseCategories } from '../services/CategoryService';
import {
  authenticateBiometric,
  clearPin,
  consumeAutoLockPause,
  getBiometricEnabled,
  getDeviceAuthInfo,
  getRelockAfter,
  hasPin,
  lockoutRemaining,
  setPin,
  useAppLock,
  verifyDeviceOwner,
  verifyPin,
  PIN_LENGTH,
  type DeviceAuthInfo,
} from '../services/AppLockService';

type Mode = 'unlock' | 'reset-new' | 'reset-confirm';

function formatWait(ms: number) {
  const s = Math.ceil(ms / 1000);
  return s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : `${s} detik`;
}

function LockScreen() {
  const realm = useRealm();
  const unlock = useAppLock((s) => s.unlock);
  const settings = useSettingsStore((s) => s.settings);
  const [mode, setMode] = useState<Mode>('unlock');
  const [newPin, setNewPin] = useState('');
  const [error, setError] = useState<string>();
  const [errorKey, setErrorKey] = useState(0);
  const [wait, setWait] = useState(lockoutRemaining());
  const [device, setDevice] = useState<DeviceAuthInfo | null>(null);
  const autoPrompted = useRef(false);

  // Tombol kembali Android tidak boleh membuka layar di balik kunci.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, []);

  const fail = (msg: string) => {
    setError(msg);
    setErrorKey((k) => k + 1);
  };

  const tryBiometric = useCallback(async () => {
    if (await authenticateBiometric('Buka Dompetku')) unlock();
  }, [unlock]);

  useEffect(() => {
    getDeviceAuthInfo().then((info) => {
      setDevice(info);
      // Langsung tawarkan biometrik sekali saat layar kunci muncul.
      if (info.biometric && getBiometricEnabled() && !autoPrompted.current && lockoutRemaining() === 0) {
        autoPrompted.current = true;
        tryBiometric();
      }
    });
  }, [tryBiometric]);

  // Hitung mundur saat dikunci sementara karena terlalu sering salah.
  useEffect(() => {
    if (wait <= 0) return;
    const t = setInterval(() => setWait(lockoutRemaining()), 1000);
    return () => clearInterval(t);
  }, [wait]);

  const onComplete = async (pin: string) => {
    if (mode === 'unlock') {
      const r = await verifyPin(pin);
      if (r.ok) return unlock();
      if (r.lockedMs) {
        setWait(r.lockedMs);
        return fail('Terlalu sering salah.');
      }
      return fail(r.attemptsLeft <= 2 ? `PIN salah. Sisa ${r.attemptsLeft} kali coba.` : 'PIN salah, coba lagi.');
    }
    if (mode === 'reset-new') {
      setNewPin(pin);
      setError(undefined);
      return setMode('reset-confirm');
    }
    if (pin !== newPin) {
      setMode('reset-new');
      setNewPin('');
      return fail('PIN tidak sama. Ulangi dari awal.');
    }
    await setPin(pin);
    unlock();
  };

  const wipeAndUnlock = () =>
    Alert.alert(
      'Hapus semua data?',
      'Semua catatan keuangan, kantong, dan goal di HP ini akan hilang permanen. Kalau punya file cadangan, kamu bisa memulihkannya lagi setelah ini.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus semua',
          style: 'destructive',
          onPress: async () => {
            realm.write(() => {
              realm.deleteAll();
              ensureDefaultExpenseCategories(realm);
            });
            await clearPin();
            unlock();
          },
        },
      ],
    );

  const forgot = () => {
    const buttons: Parameters<typeof Alert.alert>[2] = [{ text: 'Batal', style: 'cancel' }];
    if (device?.deviceCredential) {
      buttons.push({
        text: 'Pakai kunci HP',
        onPress: async () => {
          if (await verifyDeviceOwner('Verifikasi untuk membuat PIN baru')) {
            setError(undefined);
            setMode('reset-new');
          }
        },
      });
    }
    buttons.push({ text: 'Hapus data', style: 'destructive', onPress: wipeAndUnlock });
    Alert.alert(
      'Lupa PIN?',
      device?.deviceCredential
        ? 'Buktikan ini HP kamu pakai sidik jari, wajah, atau kunci layar HP, lalu buat PIN baru. Datamu tetap aman.'
        : 'HP ini tidak punya kunci layar untuk verifikasi. Satu-satunya cara membuka kunci adalah menghapus semua data.',
      buttons,
    );
  };

  const name = settings.displayName?.trim();
  const locked = wait > 0;
  const canBio = mode === 'unlock' && device?.biometric && getBiometricEnabled();

  const title = mode === 'unlock' ? 'Masukkan PIN' : mode === 'reset-new' ? 'Buat PIN baru' : 'Ulangi PIN baru';
  const subtitle = locked
    ? `Coba lagi dalam ${formatWait(wait)}`
    : mode === 'unlock'
      ? name
        ? `Hai, ${name}`
        : 'Dompetku terkunci'
      : `${PIN_LENGTH} angka yang mudah kamu ingat, tapi sulit ditebak orang lain.`;

  return (
    <SafeAreaView style={styles.lock} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.top}>
        <ProfileAvatar name={name} emoji={settings.avatarEmoji} color={settings.avatarColor} size={64} />
      </View>
      <PinPad
        title={title}
        subtitle={subtitle}
        error={error}
        errorKey={errorKey}
        disabled={locked && mode === 'unlock'}
        onComplete={onComplete}
        leftAction={canBio ? { icon: 'fingerprint', label: `Buka pakai ${device!.label}`, onPress: tryBiometric } : undefined}
      />
      <View style={styles.bottom}>
        {mode === 'unlock' ? (
          <TouchableOpacity onPress={forgot} hitSlop={12}>
            <Text style={styles.link}>Lupa PIN?</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setMode('unlock');
              setNewPin('');
              setError(undefined);
            }}
            hitSlop={12}
          >
            <Text style={styles.link}>Batal</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

/**
 * Tutup seluruh app dengan layar PIN saat kunci aktif: waktu app dibuka, dan
 * saat kembali dari latar belakang lebih lama dari "Kunci lagi setelah".
 */
export function AppLockGate({ children }: { children: React.ReactNode }) {
  const locked = useAppLock((s) => s.locked);
  const lock = useAppLock((s) => s.lock);
  const leftAt = useRef<number | null>(null);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'background') {
        leftAt.current = Date.now();
        return;
      }
      if (state !== 'active' || leftAt.current === null) return;
      const away = Date.now() - leftAt.current;
      leftAt.current = null;
      if (consumeAutoLockPause()) return;
      if (hasPin() && away >= getRelockAfter() * 1000) lock();
    });
    return () => sub.remove();
  }, [lock]);

  return (
    <View style={styles.root}>
      {children}
      {locked && (
        <View style={StyleSheet.absoluteFill}>
          <LockScreen />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  lock: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'space-between', paddingVertical: SPACING.xl },
  top: { alignItems: 'center', marginTop: SPACING.xl },
  bottom: { alignItems: 'center', paddingBottom: SPACING.lg },
  link: { fontSize: FONTS.md, fontWeight: '600', color: COLORS.primary },
});
