'use client'
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react'
import RootStore from '@store/globalStores/RootStore/RootStore'
import { enableStaticRendering } from 'mobx-react-lite'

enableStaticRendering(typeof window === 'undefined')

const StoreContext = createContext<RootStore | null>(null)
const store = new RootStore()

export const StoreProvider = ({ children }: { children: ReactNode }) => (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
)

export const useRootStore = () => {
    const ctx = useContext(StoreContext)
    if (!ctx) throw new Error('useRootStore must be used within StoreProvider')
    return ctx
}
