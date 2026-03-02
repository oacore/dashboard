import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { downloadCsv as downloadCsvUtil } from '@utils/downloadUtils';

interface DoiActions {
    setSearchTerm: (term: string) => void;
    downloadCsv: () => void;
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

            downloadCsv: () => {
                const { selectedDataProvider } = useDataProviderStore.getState();
                const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;
                const csvUrl = `${baseUrl}/internal/data-providers/${selectedDataProvider?.id}/doi?accept=text/csv`;
                downloadCsvUtil(csvUrl, 'doi-csv');
            },
        }),
        { name: 'doi-store' }
    )
);
