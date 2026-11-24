import Realm, { ObjectSchema } from 'realm';

/**
 * Target tabungan. Tidak menyimpan saldo sendiri: progres dihitung dari
 * transaksi Tabungan yang ditandai Expense.goalId (lihat services/GoalService).
 */
export class GoalModel extends Realm.Object<GoalModel> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  /** Nama ikon MaterialIcons. */
  icon!: string;
  target!: number;
  /** 'YYYY-MM-DD'. '' = tanpa tenggat. */
  deadline!: string;
  /** AccountModel._id (hex) kantong tabungan default saat setor. '' = bebas. */
  accountId!: string;
  /** Tanggal target pertama kali terkumpul. '' = belum tercapai. */
  doneAt!: string;
  note!: string;
  createdAt!: Date;

  static schema: ObjectSchema = {
    name: 'Goal',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      name: 'string',
      icon: { type: 'string', default: 'flag' },
      target: 'double',
      deadline: { type: 'string', default: '' },
      accountId: { type: 'string', default: '' },
      doneAt: { type: 'string', default: '' },
      note: { type: 'string', default: '' },
      createdAt: { type: 'date', default: () => new Date() },
    },
  };
}
