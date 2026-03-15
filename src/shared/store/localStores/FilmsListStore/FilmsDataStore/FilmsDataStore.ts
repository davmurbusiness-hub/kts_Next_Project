import type { Film } from '@shared-types/FilmType';
import type { ILocalStore } from '@hooks/useLocalStore';
import { makeObservable, observable, runInAction } from 'mobx';
import { Meta } from '@utils/meta';
import ApiStore from '@api/ApiStore';
import type { MetaFromResponse } from '@api/ApiTypes';
import type { Category } from '@shared-types/CategoryType';

type InitialData = {
  films?: Film[];
  categories?: Category[];
  responseMeta?: MetaFromResponse;
};

export default class FilmsDataStore implements ILocalStore {
  private readonly _apiStore = new ApiStore('https://front-school-strapi.ktsdev.ru');
  private _abortController: AbortController | null = null;

  films: Film[] = [];
  categories: Category[] = [];
  responseMeta: MetaFromResponse | null = null;
  meta: Meta = Meta.initial;

  constructor(initialData?: InitialData) {
    makeObservable<FilmsDataStore>(this, {
      films: observable.ref,
      categories: observable.ref,
      responseMeta: observable.ref,
      meta: observable,
    });
    if (initialData) {
      runInAction(() => {
        if (initialData.films) {
          this.films = initialData.films;
          this.meta = Meta.success;
        }
        if (initialData.categories) {
          this.categories = initialData.categories;
        }
        if (initialData.responseMeta) {
          this.responseMeta = initialData.responseMeta;
        }
      });
    }
  }

  private abortPrevious(): AbortController {
    this._abortController?.abort();
    const newController = new AbortController();
    this._abortController = newController;
    return newController;
  }

  async getCategories(): Promise<void> {
    if (this.categories.length > 0) return;
    try {
      const response = await this._apiStore.fetchCategories();
      runInAction(() => {
        if (response) {
          this.categories = response.data;
        }
      });
    } catch {
      /* empty */
    }
  }

  async getFilmsList(page = 1, searchValue = '', selectedCategories: number[] = []): Promise<void> {
    const controller = this.abortPrevious();

    runInAction(() => {
      this.meta = Meta.loading;
    });

    try {
      const response = await this._apiStore.fetchData(page, {
        signal: controller.signal,
        searchValue,
        selectedCategories,
      });

      runInAction(() => {
        if (!response) {
          this.meta = Meta.error;
          return;
        }

        const filmsData: Film[] = Array.isArray(response.data) ? response.data : [response.data];

        if (page === 1) {
          this.films = filmsData;
          this.responseMeta = response.meta;
        } else {
          const filmsMap = new Map<number, Film>(this.films.map((film) => [film.id, film]));

          filmsData.forEach((film) => {
            filmsMap.set(film.id, film);
          });

          this.films = Array.from(filmsMap.values());
        }

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

  destroy(): void {
    this._abortController?.abort();
    this._abortController = null;

    runInAction(() => {
      this.films = [];
      this.meta = Meta.initial;
    });
  }
}
