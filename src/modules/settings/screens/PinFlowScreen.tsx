import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { COLORS, SPACING } from '../../../theme';
import { PinPad } from '../../../components/lock/PinPad';
import type { RootStackParamList } from '../../../navigation/types';
import {
  PIN_LENGTH,
  authenticateBiometric,
  clearPin,
  getDeviceAuthInfo,
  lockoutRemaining,
  setBiometricEnabled,
  setPin,
  verifyPin,
} from '../../../services/AppLockService';

type Props = NativeStackScreenProps<RootStackParamList, 'PinFlow'>;
type Step = 'current' | 'new' | 'confirm';

const STEPS: Record<RootStackParamList['PinFlow']['mode'], Step[]> = {
  create: ['new', 'confirm'],
  change: ['current', 'new', 'confirm'],
  disable: ['current'],
};

const TEXT: Record<Step, { title: string; subtitle: string }> = {
  current: { title: 'Masukkan PIN sekarang', subtitle: 'Untuk memastikan ini memang kamu.' },
  new: { title: 'Buat PIN', subtitle: `${PIN_LENGTH} angka yang mudah kamu ingat, tapi sulit ditebak orang lain.` },
  confirm: { title: 'Ulangi PIN', subtitle: 'Ketik sekali lagi supaya tidak salah.' },
};

/** Buat, ubah, atau matikan PIN kunci aplikasi. */
export function PinFlowScreen({ navigation, route }: Props) {
  const { mode } = route.params;
  const steps = STEPS[mode];
  const [step, setStep] = useState<Step>(steps[0]);
  const [newPin, setNewPin] = useState('');
  const [error, setError] = useState<string>();
  const [errorKey, setErrorKey] = useState(0);
  const [wait, setWait] = useState(lockoutRemaining());

  useEffect(() => {
    if (wait <= 0) return;
    const t = setInterval(() => setWait(lockoutRemaining()), 1000);
    return () => clearInterval(t);
  }, [wait]);

  const fail = (msg: string) => {
    setError(msg);
    setErrorKey((k) => k + 1);
  };

  const finishCreate = async (pin: string) => {
    await setPin(pin);
    if (mode === 'change') {
      Alert.alert('PIN diganti', 'Pakai PIN baru mulai sekarang.');
      return navigation.goBack();
    }
    const device = await getDeviceAuthInfo();
    if (!device.biometric) return navigation.goBack();
    Alert.alert('Kunci aktif', `Mau buka Dompetku pakai ${device.label} juga? PIN tetap bisa dipakai.`, [
      { text: 'Nanti saja', style: 'cancel', onPress: () => navigation.goBack() },
      {
        text: 'Aktifkan',
        onPress: async () => {
          if (await authenticateBiometric(`Aktifkan buka pakai ${device.label}`)) setBiometricEnabled(true);
          navigation.goBack();
        },
      },
    ]);
  };

  const onComplete = async (pin: string) => {
    if (step === 'current') {
      const r = await verifyPin(pin);
      if (!r.ok) {
        if (r.lockedMs) {
          setWait(r.lockedMs);
          return fail('Terlalu sering salah.');
        }
        return fail(r.attemptsLeft <= 2 ? `PIN salah. Sisa ${r.attemptsLeft} kali coba.` : 'PIN salah, coba lagi.');
      }
      if (mode === 'disable') {
        await clearPin();
        Alert.alert('Kunci dimatikan', 'Dompetku tidak akan minta PIN lagi.');
        return navigation.goBack();
      }
      setError(undefined);
      return setStep('new');
    }
    if (step === 'new') {
      setNewPin(pin);
      setError(undefined);
      return setStep('confirm');
    }
    if (pin !== newPin) {
      setNewPin('');
      setStep('new');
      return fail('PIN tidak sama. Ulangi dari awal.');
    }
    await finishCreate(pin);
  };

  const locked = step === 'current' && wait > 0;
  const t = TEXT[step];

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <PinPad
        title={t.title}
        subtitle={locked ? `Terlalu sering salah. Coba lagi dalam ${Math.ceil(wait / 1000)} detik.` : t.subtitle}
        error={error}
        errorKey={errorKey}
        disabled={locked}
        onComplete={onComplete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', paddingBottom: SPACING.xxxl },
});
