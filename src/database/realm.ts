import Realm from 'realm';
import { ALL_MODELS } from '../models';

export const realmConfig: Realm.Configuration = {
  schema: ALL_MODELS,
  schemaVersion: 6,
};
