import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export interface BackupData {
  version: number;
  exportDate: string;
  incomes: object[];
  expenses: object[];
  debts: object[];
  debtPayments: object[];
  savings: object[];
  savingHistory: object[];
  investments: object[];
  physicalAssets: object[];
  goals: object[];
  categories: object[];
}

export async function exportBackup(data: BackupData): Promise<void> {
  const filename = `dompetku_backup_${new Date().toISOString().split('T')[0]}.json`;
  const file = new File(Paths.document, filename);
  file.write(JSON.stringify(data, null, 2));

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/json',
      dialogTitle: 'Export Data Dompetku',
    });
  }
}

export async function readBackupFile(uri: string): Promise<BackupData> {
  const file = new File(uri);
  const content = await file.text();
  const data = JSON.parse(content) as BackupData;
  if (!data.version) throw new Error('Invalid backup file');
  return data;
}
