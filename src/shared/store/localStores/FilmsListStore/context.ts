import { createLocalContext } from '@store/createLocalContext';
import FilmsListStore from '@store/localStores/FilmsListStore/FilmsListStore';

export const { Provider: FilmsStoreProvider, useStore: useFilmsStore } =
  createLocalContext(FilmsListStore);
