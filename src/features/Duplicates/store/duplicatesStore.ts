import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface DuplicatesStoreState {
    duplicatesList: unknown[];
    duplicatesDataLoading: boolean;
    sortField: string | null;
    sortOrder: 'asc' | 'desc' | null;
    selectedArticleId: string | null;
}

interface DuplicatesActions {
    setDuplicatesList: (data: unknown[]) => void;
    setDuplicatesDataLoading: (loading: boolean) => void;
    setSortField: (field: string | null) => void;
    setSortOrder: (order: 'asc' | 'desc' | null) => void;
    setSelectedArticleId: (id: string | null) => void;
}

type DuplicatesStore = DuplicatesStoreState & DuplicatesActions;

export const useDuplicatesStore = create<DuplicatesStore>()(
    devtools(
        (set) => ({
            // Initial state
            duplicatesList: [],
            duplicatesDataLoading: false,
            sortField: null,
            sortOrder: null,
            selectedArticleId: null,

            // Actions
            setDuplicatesList: (data: unknown[]) => {
                set({ duplicatesList: data });
            },

            setDuplicatesDataLoading: (loading: boolean) => {
                set({ duplicatesDataLoading: loading });
            },

            setSortField: (field: string | null) => {
                set({ sortField: field });
            },

            setSortOrder: (order: 'asc' | 'desc' | null) => {
                set({ sortOrder: order });
            },

            setSelectedArticleId: (id: string | null) => {
                set({ selectedArticleId: id });
            },
        }),
        {
            name: 'duplicates-store',
        }
    )
);
