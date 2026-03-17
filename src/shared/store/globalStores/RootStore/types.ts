import type QueryParamsStore from '@store/globalStores/QueryParamsStore/QueryParamsStore';
import type AuthStore from '@store/globalStores/AuthStore/AuthStore';

export type IRootStore = {
  readonly query: QueryParamsStore;
  readonly auth: AuthStore;
};
