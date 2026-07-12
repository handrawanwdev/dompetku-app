import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({ id: 'dompetku-error-logs' });

const LOGS_KEY = 'error_logs';
const MAX_LOGS = 50;

export type ErrorSource = 'render' | 'js' | 'promise';

export interface ErrorLogEntry {
  id: string;
  timestamp: string;
  source: ErrorSource;
  message: string;
  stack?: string;
  componentStack?: string;
  isFatal?: boolean;
}

function readLogs(): ErrorLogEntry[] {
  const raw = storage.getString(LOGS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeLogs(logs: ErrorLogEntry[]) {
  storage.set(LOGS_KEY, JSON.stringify(logs));
}

export function logError(entry: Omit<ErrorLogEntry, 'id' | 'timestamp'>) {
  const logs = readLogs();
  logs.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  });
  writeLogs(logs.slice(0, MAX_LOGS));
}

export function getErrorLogs(): ErrorLogEntry[] {
  return readLogs();
}

export function clearErrorLogs() {
  storage.remove(LOGS_KEY);
}

export function getDeviceInfo() {
  return {
    platform: Platform.OS,
    osVersion: String(Platform.Version),
    appVersion: Constants.expoConfig?.version ?? 'unknown',
    deviceName: Constants.deviceName ?? 'unknown',
  };
}

export function buildReportText(entry?: ErrorLogEntry): string {
  const device = getDeviceInfo();
  const header = [
    'Dompetku - Laporan Error',
    `Dibuat: ${new Date().toISOString()}`,
    `Platform: ${device.platform} ${device.osVersion}`,
    `Perangkat: ${device.deviceName}`,
    `Versi App: ${device.appVersion}`,
    '',
  ].join('\n');

  const entries = entry ? [entry] : getErrorLogs();
  if (entries.length === 0) {
    return `${header}Tidak ada error tercatat.`;
  }

  const body = entries
    .map((e) =>
      [
        `[${e.timestamp}] (${e.source}${e.isFatal ? ', fatal' : ''})`,
        `Pesan: ${e.message}`,
        e.stack ? `Stack:\n${e.stack}` : '',
        e.componentStack ? `Component Stack:\n${e.componentStack}` : '',
        '---',
      ]
        .filter(Boolean)
        .join('\n'),
    )
    .join('\n\n');

  return `${header}${body}`;
}

let installed = false;

/** Hooks into React Native's global error handler and unhandled promise rejections to persist crash reports for the Diagnosis screen. Call once at app startup. */
export function installGlobalErrorHandlers() {
  if (installed) return;
  installed = true;

  const g = globalThis as any;

  if (g.ErrorUtils?.setGlobalHandler) {
    const previousHandler = g.ErrorUtils.getGlobalHandler?.();
    g.ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
      logError({
        source: 'js',
        message: error?.message ?? String(error),
        stack: error?.stack,
        isFatal,
      });
      previousHandler?.(error, isFatal);
    });
  }

  const previousRejectionHandler = g.onunhandledrejection;
  g.onunhandledrejection = (event: any) => {
    const reason = event?.reason ?? event;
    logError({
      source: 'promise',
      message: reason?.message ?? String(reason),
      stack: reason?.stack,
    });
    previousRejectionHandler?.(event);
  };
}
