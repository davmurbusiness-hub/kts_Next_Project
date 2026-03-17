import * as React from 'react';

export type ILocalStore = {
  destroy(): void;
};

export const useLocalStore = <S extends ILocalStore>(
    creator: () => S,
    effect: React.DependencyList = []
): S => {
  const storeRef = React.useRef<S | null>(null);

  if (storeRef.current === null) {
    storeRef.current = creator();
  }

  React.useEffect(() => {
    return () => {
      storeRef.current?.destroy();
    };
     
  }, []);

  React.useEffect(() => {
    if (effect.length === 0) return;
    const prevStore = storeRef.current!;
    prevStore.destroy();
    storeRef.current = creator();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, effect);

  return storeRef.current;
};
