import type { ILocalStore } from '@hooks/useLocalStore';
import FilmDataStore from '@store/localStores/FilmsListStore/FilmsDataStore';
import { action, computed, makeObservable, observable, reaction, runInAction } from 'mobx';
import rootStore from '@store/globalStores/RootStore/instance';
import type { Option } from '@components/MultiDropdown';
import { Meta } from '@utils/meta';
import type {Film} from "@shared-types/FilmType";
import type {Category} from "@shared-types/CategoryType";
import type {MetaFromResponse} from "@api/ApiTypes";

type PrivateFields = '_initReactions';

type InitialData = {
  films?: Film[];
  categories?: Category[];
  responseMeta?: MetaFromResponse;
};

export default class FilmsListStore implements ILocalStore {
  private _filmsDataStore: FilmDataStore;
  page = 1;
  totalPages = 0;
  totalFilms = 0;
  search = '';
  currentSearch = '';
  selectedCategories: Option[] = [];
  categoriesId: number[] = [];

  constructor(initialData?: InitialData) {
    this._filmsDataStore = new FilmDataStore(initialData);
    makeObservable<FilmsListStore, PrivateFields>(this, {
      page: observable,
      totalPages: observable,
      totalFilms: observable,
      search: observable,
      currentSearch: observable,
      selectedCategories: observable.shallow,
      categoriesId: observable,

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
      _initReactions: action,
      loadFilms: action,
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

  loadFilms() {
    this._filmsDataStore.getFilmsList(this.page, this.currentSearch, this.categoriesId);
  }

  private _initReactions() {
    this._filmsDataStore.getCategories();

    reaction(
        () => ({
          search: rootStore.query.search,
          categories: rootStore.query.categories.map(Number),
          chosenCategories: this._filmsDataStore.categories,
        }),
        ({ search, categories, chosenCategories }) => {
          runInAction(() => {
            this.search = search;
            this.currentSearch = search;
            this.categoriesId = categories;
            this.page = 1;
            this.selectedCategories = chosenCategories
                .filter((cat) => this.categoriesId.includes(cat.id))
                .map((cat) => ({
                  key: String(cat.id),
                  value: cat.title,
                }));
          });
          this.loadFilms();
        },
    );

    setTimeout(() => {
      this.loadFilms();
    }, 0);

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

    rootStore.query.setParams({
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

    rootStore.query.setParams({
      search: this.currentSearch,
      page: 1,
      categories: this.categoriesId,
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
