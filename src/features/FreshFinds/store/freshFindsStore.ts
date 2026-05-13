import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { FreshFindsRecord } from '../types/data.types';

interface FreshFindsStoreState {
    freshFindsData: FreshFindsRecord[];
    freshFindsDataLoading: boolean;
}

interface FreshFindsStoreActions {
    setFreshFindsData: (data: FreshFindsRecord[]) => void;
    setFreshFindsDataLoading: (loading: boolean) => void;
}

type FreshFindsStore = FreshFindsStoreState & FreshFindsStoreActions;

export const useFreshFindsStore = create<FreshFindsStore>()(
    devtools(
        (set) => ({
            freshFindsData: [],
            freshFindsDataLoading: false,

            setFreshFindsData: (freshFindsData) => set({ freshFindsData }),
            setFreshFindsDataLoading: (freshFindsDataLoading) => set({ freshFindsDataLoading }),
        }),
        { name: 'fresh-finds-store' },
    ),
);
