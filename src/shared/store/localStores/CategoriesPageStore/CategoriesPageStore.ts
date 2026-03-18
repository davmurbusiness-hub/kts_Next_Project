import { makeObservable, observable, action, computed, runInAction } from 'mobx';
import type ApiStore from '@api/ApiStore';
import type { Film } from '@shared-types/FilmType';
import type { ILocalStore } from '@hooks/useLocalStore';


const normalizeFilms = (data: Film | Film[]): Film[] =>
    Array.isArray(data) ? data : [data];

export default class CategoriesStore implements ILocalStore {
    activeId: number | null = null;
    films: Film[] = [];
    loading = false;
    error = false;

    private readonly _api: ApiStore;
    private readonly _cache = new Map<number, Film[]>();
    private _abortController: AbortController | null = null;

    constructor(apiStore: ApiStore) {
        this._api = apiStore;
        makeObservable(this, {
            activeId:  observable,
            films:     observable,
            loading:   observable,
            error:     observable,

            hasCachedFilms: computed,
            close:   action,
        });
    }

    get hasCachedFilms(): boolean {
        return this.activeId !== null && this._cache.has(this.activeId);
    }

    prefetch = async (categoryId: number): Promise<void> => {
        if (this._cache.has(categoryId)) return;

        try {
            const response = await this._api.fetchData(1, {
                signal: undefined,
                searchValue: '',
                selectedCategories: [categoryId],
                sortingInfo: [],
            });

            if (response?.data) {
                this._cache.set(categoryId, normalizeFilms(response.data));
            }
        } catch {
            //
        }
    };

    open = async (categoryId: number): Promise<void> => {
        runInAction(() => {
            this.activeId = categoryId;
            this.error = false;
        });

        if (this._cache.has(categoryId)) {
            runInAction(() => {
                this.films = this._cache.get(categoryId)!;
                this.loading = false;
            });
            return;
        }


        this._abortController?.abort();
        this._abortController = new AbortController();

        runInAction(() => {
            this.loading = true;
            this.films = [];
        });

        try {
            const response = await this._api.fetchData(1, {
                signal: this._abortController.signal,
                searchValue: '',
                selectedCategories: [categoryId],
                sortingInfo: [],
            });

            runInAction(() => {
                if (response?.data) {
                    const normalized = normalizeFilms(response.data);
                    this.films = normalized;
                    this._cache.set(categoryId, normalized);
                } else {
                    this.error = true;
                }
            });
        } catch (e: unknown) {
            const isAbort = (e as { name?: string })?.name === 'AbortError';
            if (!isAbort) {
                runInAction(() => {
                    this.error = true;
                });
            }
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    close = (): void => {
        this._abortController?.abort();
        this.activeId = null;
        this.films = [];
        this.error = false;
        this.loading = false;
    };

    destroy(): void {
        this._abortController?.abort();
        this._cache.clear();
    }
}
