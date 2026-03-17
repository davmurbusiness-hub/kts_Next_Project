'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import {useRootStore} from "@providers/StoreProvider";

export const useQueryParamsStoreInit = (): void => {
  const searchParams = useSearchParams();
  const rootStore = useRootStore()

  useEffect(() => {
    const queryString = searchParams.toString();
    const search = queryString ? `?${queryString}` : '';
    rootStore.query.setSearch(search);
  }, [rootStore.query, searchParams]);
};

function QueryParamsInitializer() {
  useQueryParamsStoreInit();
  return null;
}

export const QueryParamsStoreInitializer = () => (
    <Suspense fallback={null}>
        <QueryParamsInitializer />
        </Suspense>
);
