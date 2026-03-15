import * as React from 'react';

export type ILocalStore = {
  destroy(): void;
};

export const useLocalStore = <S extends ILocalStore>(
    creator: () => S,
    effect: React.DependencyList = []
): S => {
  const isFirstRender = React.useRef(true);
  const [store, setStore] = React.useState(creator);

  React.useEffect(() => {
    return () => store.destroy();
  }, [store]);

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setStore((prevStore) => {
      prevStore.destroy();
      return creator();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, effect);

  return store;
};
