import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface DoiActions {
    setSearchTerm: (term: string) => void;
    resetOnPageEnter: () => void;
}

export interface DoiStoreState {
    searchTerm: string;
}

type DoiStore = DoiStoreState & DoiActions;

export const useDoiStore = create<DoiStore>()(
    devtools(
        (set) => ({
            searchTerm: '',

            setSearchTerm: (searchTerm) => set({ searchTerm }),

            resetOnPageEnter: () => set({ searchTerm: '' }),
        }),
        { name: 'doi-store' }
    )
);
