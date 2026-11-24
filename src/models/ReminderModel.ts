import Realm, { ObjectSchema } from 'realm';

export type ReminderRepeat = 'once' | 'monthly' | 'yearly';

/**
 * Pengingat tagihan buatan user (listrik, BPJS, langganan, pajak motor).
 * Tidak pernah membuat transaksi otomatis; notif membuka form uang keluar
 * yang sudah terisi. Hitungan jatuh tempo ada di utils/reminder.
 */
export class ReminderModel extends Realm.Object<ReminderModel> {
  _id!: Realm.BSON.ObjectId;
  title!: string;
  /** 0 = nominal tidak tentu. */
  amount!: number;
  /** Nama kategori uang keluar untuk prefill form. '' = bebas. */
  categoryName!: string;
  repeat!: ReminderRepeat;
  /** 'YYYY-MM-DD' jatuh tempo pertama. monthly pakai tanggalnya, yearly bulan+tanggal. */
  dueDate!: string;
  /** Periode terakhir yang sudah dibayar: 'YYYY-MM' / 'YYYY' / 'once'. '' = belum. */
  lastDonePeriod!: string;
  createdAt!: Date;

  static schema: ObjectSchema = {
    name: 'Reminder',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      title: 'string',
      amount: { type: 'double', default: 0 },
      categoryName: { type: 'string', default: '' },
      repeat: { type: 'string', default: 'monthly' },
      dueDate: 'string',
      lastDonePeriod: { type: 'string', default: '' },
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}
