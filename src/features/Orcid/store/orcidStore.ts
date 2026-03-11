import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface OrcActions {
    setSearchTerm: (term: string) => void;
    setSelectedArticleId: (id: string | null) => void;
    resetOnPageEnter: () => void;
}

export interface OrcidStoreState {
    searchTerm: string;
    selectedArticleId: string | null;
}

type OrcidStore = OrcidStoreState & OrcActions;

export const useOrcidTableStore = create<OrcidStore>()(
    devtools(
        (set) => ({
            // Initial state
            searchTerm: '',
            selectedArticleId: null,

            // Actions
            setSearchTerm: (term: string) => {
                set({ searchTerm: term });
            },

            setSelectedArticleId: (id: string | null) => {
                set({ selectedArticleId: id });
            },

            resetOnPageEnter: () => {
                set({ searchTerm: '', selectedArticleId: null });
            },
        }),
        {
            name: 'orcid-table-store',
        }
    )
);
