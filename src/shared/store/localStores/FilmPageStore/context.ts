import { createLocalContext } from '@store/createLocalContext';
import FilmPageStore from '@store/localStores/FilmPageStore/FilmPageStore';

export const { Provider: FilmStoreProvider, useStore: useFilmStore } =
  createLocalContext(FilmPageStore);
