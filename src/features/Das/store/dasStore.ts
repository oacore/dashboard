import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface DasStoreState {
    dasList: never[];
    dasDataLoading: boolean;
  // UI State
  sortField: string | null;
  sortOrder: 'asc' | 'desc' | null;
  selectedArticleId: string | null;
}

interface DasActions {
    setDasList: (data: never[]) => void;
    setDasDataLoading: (loading: boolean) => void;
  // Actions
  setSortField: (field: string | null) => void;
  setSortOrder: (order: 'asc' | 'desc' | null) => void;
  setSelectedArticleId: (id: string | null) => void;
}

type DasStore = DasStoreState & DasActions;

export const useDasStore = create<DasStore>()(
    devtools(
        (set) => ({
            // Initial state
            dasList: [],
            dasDataLoading: false,
          // Initial state
          sortField: null,
          sortOrder: null,
          selectedArticleId: null,

            // Actions
            setDasList: (data: never[]) => {
                set({ dasList: data });
            },

            setDasDataLoading: (loading: boolean) => {
                set({ dasDataLoading: loading });
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
            name: 'das-store',
        }
    )
);
