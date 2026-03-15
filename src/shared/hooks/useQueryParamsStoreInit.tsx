'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import rootStore from '@store/globalStores/RootStore/instance';

export const useQueryParamsStoreInit = (): void => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const queryString = searchParams.toString();
    const search = queryString ? `?${queryString}` : '';
    rootStore.query.setSearch(search);
  }, [searchParams]);
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
