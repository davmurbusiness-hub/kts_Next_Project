'use client'
import React from 'react';

export type ILocalStore = {
  destroy(): void;
};

export const useLocalStore = <S extends ILocalStore>(
  creator: () => S,
  deps: React.DependencyList = []
): S => {
  const storeRef = React.useRef<S | null>(null);

  if (!storeRef.current) {
    storeRef.current = creator();
  }

  React.useEffect(() => {
    const store = storeRef.current;

    return () => {
      store?.destroy();
    };
  }, []);

  React.useEffect(() => {
    storeRef.current?.destroy();
    storeRef.current = creator();
  }, deps);

  return storeRef.current;
};
