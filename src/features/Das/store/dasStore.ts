import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {downloadCsv} from '@utils/downloadUtils.ts';
import {useDataProviderStore} from '@/store/dataProviderStore.ts';

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
  downloadCsv: () => void;
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
          downloadCsv: () => {
            const { selectedDataProvider } = useDataProviderStore.getState();

            const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;
            const csvUrl = `${baseUrl}/internal/data-providers/${selectedDataProvider?.id}/data-access?accept=text/csv`;
            downloadCsv(csvUrl, 'das');
          },
        }),
        {
            name: 'das-store',
        }
    )
);
