import AuthStore from '../AuthStore/AuthStore';
import QueryParamsStore from '../QueryParamsStore/QueryParamsStore';
import type { IRootStore } from 'store/globalStores/RootStore/types';

export default class RootStore implements IRootStore {
  readonly query: QueryParamsStore;
  readonly auth: AuthStore;

  constructor() {
    this.query = new QueryParamsStore(this);
    this.auth = new AuthStore(this);
  }

  destroy = (): void => {
    this.query.destroy?.();
    this.auth.destroy?.();
  };
}
