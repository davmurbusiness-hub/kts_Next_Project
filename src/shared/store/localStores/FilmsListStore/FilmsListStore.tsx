import type {ILocalStore} from '@hooks/useLocalStore';
import {parse} from 'qs';
import FilmDataStore from '@store/localStores/FilmsListStore/FilmsDataStore';
import {action, autorun, computed, makeObservable, observable, reaction, runInAction} from 'mobx';
import type RootStore from '@store/globalStores/RootStore/RootStore';
import type {Option} from '@components/MultiDropdown';
import {Meta} from '@utils/meta';
import type {Film} from "@shared-types/FilmType";
import type {Category} from "@shared-types/CategoryType";
import type {MetaFromResponse} from "@api/ApiTypes";
import type {SortState} from "@components/Sorter";
import type {ToastApi} from "@providers/Toast/ToastProvider";

type PrivateFields = '_initReactions';

type InitialData = {
    films?: Film[];
    categories?: Category[];
    responseMeta?: MetaFromResponse;
    rootStore: RootStore;
    toast: ToastApi;
    initialQueryString?: string;
};

function parseSortStrings(sortStrings: string[]): SortState[] {
    return sortStrings.map((s) => {
        const colonIndex = s.lastIndexOf(':');
        if (colonIndex === -1) {
            return {id: s, enabled: true, descending: false};
        }
        const id = s.slice(0, colonIndex);
        const dir = s.slice(colonIndex + 1);
        return {id, enabled: true, descending: dir === 'desc'};
    });
}

export default class FilmsListStore implements ILocalStore {
    private _filmsDataStore: FilmDataStore;
    private _rootStore: RootStore;
    private _toast: ToastApi;
    page = 1;
    totalPages = 0;
    totalFilms = 0;
    search = '';
    currentSearch = '';
    selectedCategories: Option[] = [];
    categoriesId: number[] = [];
    selectedSortState: SortState[] = [];
    sort: string[] = [];
    isModalOpen = false;
    isTrailerOpen = false;
    trailerUrl = '';
    private _isReady = false;
    private _initialQueryString: string;

    constructor(initialData: InitialData) {
        this._rootStore = initialData.rootStore;
        this._toast = initialData.toast;
        this._initialQueryString = initialData.initialQueryString ?? '';
        this._filmsDataStore = new FilmDataStore(initialData);
        makeObservable<FilmsListStore, PrivateFields>(this, {
            page: observable,
            totalPages: observable,
            totalFilms: observable,
            search: observable,
            currentSearch: observable,
            selectedCategories: observable.shallow,
            categoriesId: observable,
            sort: observable,
            selectedSortState: observable,
            isModalOpen: observable,
            isTrailerOpen: observable,
            trailerUrl: observable,

            films: computed,
            categoryOptions: computed,
            isLoading: computed,
            hasMore: computed,
            selectedCat: computed,

            setSearchValue: action,
            searchHandler: action,
            setCategories: action,
            loadNextPage: action,
            getDisplayTitle: action,
            setSort: action,
            _initReactions: action,
            loadFilms: action,
            openModal: action,
            closeModal: action,
            openTrailer: action,
            closeTrailer: action,
            handleFavoriteClick: action,
            init: action,
        });

        this._initReactions();
    }

    get films() {
        return this._filmsDataStore.films;
    }

    get categoryOptions(): Option[] {
        return this._filmsDataStore.categories.map((cat) => ({
            key: String(cat.id),
            value: cat.title,
        }));
    }

    get isLoading() {
        return this._filmsDataStore.meta !== Meta.success;
    }

    get hasMore() {
        return this.page < this.totalPages;
    }

    get selectedCat() {
        return this.selectedCategories.slice();
    }

    openModal = () => {
        this.isModalOpen = true;
    };

    closeModal = () => {
        this.isModalOpen = false;
    };

    openTrailer = (url: string) => {
        this.trailerUrl = url;
        this.isTrailerOpen = true;
    };

    closeTrailer = () => {
        this.isTrailerOpen = false;
        this.trailerUrl = '';
    };

    init = () => {
        this._isReady = true;
        this.loadFilms();
    };

    handleFavoriteClick = (film: Film) => {
        if (this._rootStore.auth.authorized) {
            const isFavorite = this._rootStore.auth.favorites.some(f => f.id === film.id);

            if (isFavorite) {
                this._rootStore.auth.removeFavorite(film);
                this._toast.success('Фильм "' + film.title + '" удалён из избранного');
            } else {
                this._rootStore.auth.addFavorite(film);
                this._toast.success('Фильм "' + film.title + '" добавлен в избранное');
            }
        } else {
            this.openModal();
        }
    };

    loadFilms() {
        this._filmsDataStore.getFilmsList(this.page, this.currentSearch, this.categoriesId, this.sort);
    }

    private _initReactions() {
        this._filmsDataStore.getCategories();

        autorun(() => {
            const fromQuery = this._rootStore.query.search !== '' ||
                this._rootStore.query.categories.length > 0 ||
                this._rootStore.query.sort.length > 0;

            let search: string;
            let categories: number[];
            let sort: string[];

            if (fromQuery) {
                search = this._rootStore.query.search;
                categories = this._rootStore.query.categories.map(Number);
                sort = this._rootStore.query.sort;
            } else if (this._initialQueryString) {
                const parsed = parse(this._initialQueryString);
                search = typeof parsed.search === 'string' ? parsed.search : '';
                const rawCat = parsed.categories;
                categories = (Array.isArray(rawCat) ? rawCat : rawCat !== undefined ? [rawCat] : []).map(Number).filter(Boolean);
                const rawSort = parsed.sort;
                sort = (Array.isArray(rawSort) ? rawSort : rawSort !== undefined ? [rawSort] : []).map(String);
            } else {
                search = this._rootStore.query.search;
                categories = this._rootStore.query.categories.map(Number);
                sort = this._rootStore.query.sort;
            }

            const chosenCategories = this._filmsDataStore.categories;

            runInAction(() => {
                this.search = search;
                this.currentSearch = search;
                this.categoriesId = categories;
                this.sort = sort;
                this.selectedSortState = parseSortStrings(sort);
                this.page = 1;
                this.selectedCategories = chosenCategories
                    .filter((cat) => this.categoriesId.includes(cat.id))
                    .map((cat) => ({
                        key: String(cat.id),
                        value: cat.title,
                    }));
            });
            if (this._isReady) {
                this.loadFilms();
            }
        });

        reaction(
            () => this._filmsDataStore.responseMeta?.pagination,
            (pagination) => {
                if (!pagination) return;

                runInAction(() => {
                    this.totalPages = pagination.pageCount;
                    this.totalFilms = pagination.total;
                });
            }
        );
    }

    setSearchValue = (value: string) => {
        this.search = value;
    };

    searchHandler = () => {
        this.page = 1;
        this.currentSearch = this.search;

        this._rootStore.query.setParams({
            search: this.search,
            page: 1,
            categories: this.categoriesId,
        });

        this.loadFilms();
    };

    setCategories = (values: Option[]) => {
        this.selectedCategories = values;
        this.page = 1;
        this.categoriesId = values.map((v) => Number(v.key));

        this._rootStore.query.setParams({
            search: this.currentSearch,
            page: 1,
            categories: this.categoriesId,
        });
        this.loadFilms();
    };

    setSort = (value: SortState[]) => {
        const tempSort: string[] = [];
        value.forEach((option) => {
            if (option.enabled) {
                tempSort.push(`${option.id}:${option.descending ? 'desc' : 'asc'}`);
            }
        });

        this.sort = tempSort;
        this.selectedSortState = value;
        this.page = 1;

        this._rootStore.query.setParams({
            search: this.currentSearch,
            page: 1,
            categories: this.categoriesId,
            sort: tempSort,
        });

        this.loadFilms();
    };

    loadNextPage = () => {
        if (!this.hasMore || this.isLoading) return;

        this.page += 1;
        this.loadFilms();
    };

    getDisplayTitle = (values: Option[]) => {
        if (values.length === 0) {
            return 'Выберите жанр фильма';
        }

        return values.map((v) => v.value).join(', ');
    };

    destroy(): void {
        this._filmsDataStore.destroy();
    }
}
