import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface RrsStoreState {
    rrsList: never[];
    rrsDataLoading: boolean;
  // UI State
  sortField: string | null;
  sortOrder: 'asc' | 'desc' | null;
  selectedArticleId: string | null;
}

interface RrsActions {
    setRrsList: (data: never[]) => void;
    setRrsDataLoading: (loading: boolean) => void;
  // Actions
  setSortField: (field: string | null) => void;
  setSortOrder: (order: 'asc' | 'desc' | null) => void;
  setSelectedArticleId: (id: string | null) => void;
}

type RrsStore = RrsStoreState & RrsActions;

export const useRrsStore = create<RrsStore>()(
    devtools(
        (set) => ({
            // Initial state
            rrsList: [],
            rrsDataLoading: false,
          // Initial state
          sortField: null,
          sortOrder: null,
          selectedArticleId: null,

            // Actions
            setRrsList: (data: never[]) => {
                set({ rrsList: data });
            },

            setRrsDataLoading: (loading: boolean) => {
                set({ rrsDataLoading: loading });
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
            name: 'rrs-store',
        }
    )
);
