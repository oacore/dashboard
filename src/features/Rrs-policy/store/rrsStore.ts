import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {downloadCsv} from '@utils/downloadUtils.ts';
import {useDataProviderStore} from '@/store/dataProviderStore.ts';

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
  downloadCsv: () => void;
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
          downloadCsv: () => {
            const { selectedDataProvider } = useDataProviderStore.getState();

            const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;
            const csvUrl = `${baseUrl}/internal/data-providers/${selectedDataProvider?.id}/rights-retention?accept=text/csv`;
            downloadCsv(csvUrl, 'rights-retention');
          },
        }),
        {
            name: 'rrs-store',
        }
    )
);
