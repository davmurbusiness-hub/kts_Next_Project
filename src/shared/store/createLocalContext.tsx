import type { ILocalStore } from 'hooks/useLocalStore';
import React from 'react';

export const createLocalContext = <T extends ILocalStore>(
  Constructor: new (...args: never[]) => T
) => {
  const Context = React.createContext<T | null>(null);

  const Provider = ({ children, store }: React.PropsWithChildren<{ store: T }>) => {
    React.useEffect(() => () => store.destroy(), [store]);
    return <Context.Provider value={store}>{children}</Context.Provider>;
  };

  const useStore = () => {
    const context = React.useContext(Context);
    if (!context) throw new Error(`${Constructor.name} not in Provider`);
    return context;
  };

  return { Provider, useStore };
};
