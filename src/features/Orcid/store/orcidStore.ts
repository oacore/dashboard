import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { downloadCsv } from '@utils/downloadUtils.ts';
import { useDataProviderStore } from '@/store/dataProviderStore';

interface OrcActions {
    setSearchTerm: (term: string) => void;
    setSelectedArticleId: (id: string | null) => void;
    resetOnPageEnter: () => void;
    downloadCsv: (endpoint: string) => void;
}

export interface OrcidStoreState {
    searchTerm: string;
    selectedArticleId: string | null;
    isDownloading: boolean;
}

type OrcidStore = OrcidStoreState & OrcActions;

export const useOrcidTableStore = create<OrcidStore>()(
    devtools(
        (set) => ({
            // Initial state
            searchTerm: '',
            selectedArticleId: null,
            isDownloading: false,

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

            downloadCsv: (endpoint: string) => {
                const { selectedDataProvider } = useDataProviderStore.getState();

                if (!selectedDataProvider?.id) {
                    console.error('No data provider selected');
                    return;
                }

                const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;
                const csvUrl = `${baseUrl}/internal/data-providers/${selectedDataProvider.id}${endpoint}`;

                downloadCsv(csvUrl, 'orcid-data');
            },
        }),
        {
            name: 'orcid-table-store',
        }
    )
);
