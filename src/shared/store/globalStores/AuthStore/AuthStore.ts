import { computed, makeObservable, observable, runInAction } from 'mobx';
import ApiStore from '@api/ApiStore';
import type { Film } from '@shared-types/FilmType';
import type { IGlobalStore } from '@shared-types/IGlobalStore';
import type { IRootStore } from '@store/globalStores/RootStore/types';

type PrivateFields = '_login' | '_token' | '_authorized' | '_favorites';

type requestAns = {
  success: boolean;
  message: string;
};





export default class AuthStore implements IGlobalStore {
  private readonly _apiStore = new ApiStore('https://front-school-strapi.ktsdev.ru');

  private _login = '';
  private _token = '';
  private _authorized = false;
  private _favorites: Film[] = [];

  constructor(public readonly rootStore: IRootStore) {
    makeObservable<AuthStore, PrivateFields>(this, {
      _login: observable,
      _token: observable,
      _authorized: observable,
      _favorites: observable.shallow,

      login: computed,
      token: computed,
      authorized: computed,
      favorites: computed,
    });
  }

  get login(): string {
    return this._login;
  }

  get token(): string {
    return this._token;
  }

  get authorized(): boolean {
    return this._authorized;
  }

  get favorites(): Film[] {
    return this._favorites;
  }

  async addFavorite(film: Film): Promise<void> {
    if (!this._token) return;

    const response = await this._apiStore.fetchAddFavorites(this._token, film.id);

    runInAction(() => {
      const received = response?.film
        ? Array.isArray(response.film)
          ? response.film[0]
          : response.film
        : null;

      if (!received) return;

      const alreadyExists = this._favorites.some((f) => f.id === received.id);
      if (!alreadyExists) {
        this._favorites.push(received);
      }
    });
  }

  async getFavorite(): Promise<void> {
    if (!this._token) return;

    const response = await this._apiStore.fetchGetFavorites(this._token);

    runInAction(() => {
      if (!response) return;

      const uniqueMap = new Map<number, Film>();

      response.forEach((item) => {
        if (item.film.id) {
          uniqueMap.set(item.film.id, item.film);
        }
      });

      this._favorites = Array.from(uniqueMap.values());
    });
  }

  async removeFavorite(film: Film): Promise<void> {
    if (!this._token) return;

    const response = await this._apiStore.fetchRemoveFavorites(this._token, film.id);

    runInAction(() => {
      if (!response) return;

      this._favorites = this._favorites.filter((f) => f.id !== film.id);
    });
  }

  async registerReq(login = '', password = ''): Promise<requestAns> {
    if (!login || !password)
      return {
        success: false,
        message: 'Не введен логин или пароль',
      };
    try {
      const response = await this._apiStore.register(login, login, password);
      if (!response)
        return {
          success: false,
          message: 'Неправильно введена почта, или такой логин уже существует',
        };
      runInAction(() => {
        this._login = String(response.user);
        this._authorized = true;
        this._token = response.jwt;
      });

      return {
        success: true,
        message: 'Аккаунт успешно зарегистрирован',
      };
    } catch (error) {
      return {
        success: false,
        message: String(error),
      };
    }
  }

  async loginReq(login = '', password = ''): Promise<requestAns> {
    if (!login || !password)
      return {
        success: false,
        message: 'Не введен логин или пароль',
      };

    const response = await this._apiStore.login(login, password);

    if (!response)
      return {
        success: false,
        message: 'Неверный логин или пароль',
      };

    try {
      runInAction(() => {
        this._login = String(response.user);
        this._authorized = true;
        this._token = response.jwt;
      });
      return {
        success: true,
        message: 'Вход выполнен успешно',
      };
    } catch (error) {
      return {
        success: false,
        message: String(error),
      };
    }
  }

  destroy(): void {
    /* empty */
  }
}
