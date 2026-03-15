import type { ILocalStore } from '@hooks/useLocalStore';
import type { Film } from '@shared-types/FilmType';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { Meta } from '@utils/meta';
import ApiStore from '@api/ApiStore';

type PrivateFields = '_documentId';
type InitialData = {
  film?: Film;
};

export default class FilmPageStore implements ILocalStore {
  private readonly _apiStore = new ApiStore('https://front-school-strapi.ktsdev.ru');
  private _abortController: AbortController | null = null;
  private _reactionDisposer: (() => void) | null = null;
  private _documentId = '';


  film: Film | null = null;
  meta: Meta = Meta.initial;

  constructor(documentId = '', initialData?: InitialData) {
    makeObservable<FilmPageStore, PrivateFields>(this, {
      film: observable.ref,
      meta: observable.ref,
      _documentId: observable,
      getFilm: action,
    });

    this._documentId = documentId;

    if (initialData?.film) {
      runInAction(() => {
        this.film = initialData.film!;
        this.meta = Meta.success;
      });
    } else { /* empty */ }
  }
  private abortPrevious(): AbortController {
    this._abortController?.abort();
    const newController = new AbortController();
    this._abortController = newController;
    return newController;
  }


  async getFilm(): Promise<void> {
    if (!this._documentId.trim()) return;

    const controller = this.abortPrevious();

    runInAction(() => {
      this.meta = Meta.loading;
      this.film = null;
    });

    try {
      const response = await this._apiStore.fetchFilm(this._documentId, controller.signal);
      runInAction(() => {
        if (!response) {
          this.meta = Meta.error;
          return;
        }
        this.film = response;
        this.meta = Meta.success;
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      runInAction(() => {
        this.meta = Meta.error;
      });
    } finally {
      this._abortController = null;
    }
  }

  destroy() {
    this._reactionDisposer?.();
    this._abortController?.abort();
    this._abortController = null;
    runInAction(() => {
      this.film = null;
      this.meta = Meta.initial;
    });
  }
}
