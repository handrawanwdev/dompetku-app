import { useMemo } from 'react';
import { useQuery } from '@realm/react';
import { ReminderModel } from '../../models/ReminderModel';
import { buildReminderInfos } from '../../utils/reminder';

/** Semua pengingat tagihan + jatuh tempo terdekat, urut dari yang paling dekat. */
export function useReminders() {
  const items = useQuery(ReminderModel);
  return useMemo(() => buildReminderInfos(items), [items]);
}
