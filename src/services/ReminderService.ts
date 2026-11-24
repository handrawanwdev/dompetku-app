import Realm from 'realm';
import { ReminderModel } from '../models/ReminderModel';

/**
 * Tandai periode tagihan sudah dibayar. Tidak pernah mundur, jadi notif lama
 * yang diketuk setelah dibayar tidak menandai periode berikutnya.
 * Harus dipanggil di dalam realm.write().
 */
export function markReminderDone(realm: Realm, id: string, period: string) {
  if (!Realm.BSON.ObjectId.isValid(id) || !period) return;
  const r = realm.objectForPrimaryKey(ReminderModel, new Realm.BSON.ObjectId(id));
  if (r && (!r.lastDonePeriod || period > r.lastDonePeriod)) r.lastDonePeriod = period;
}
