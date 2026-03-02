import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { downloadCsv } from '@utils/downloadUtils';
import { useDataProviderStore } from '@/store/dataProviderStore';

interface IndexingStoreState {
    selectedArticleId: string | null;
}

interface IndexingActions {
    setSelectedArticleId: (id: string | null) => void;
    downloadIssuesCsv: (type?: string) => void;
}

type IndexingStore = IndexingStoreState & IndexingActions;

export const useIndexingStore = create<IndexingStore>()(
    devtools(
        (set) => ({
            // Initial state
            selectedArticleId: null,

            // Actions
            setSelectedArticleId: (id: string | null) => {
                set({ selectedArticleId: id });
            },

            downloadIssuesCsv: (type?: string) => {
                const { selectedDataProvider } = useDataProviderStore.getState();

                if (!selectedDataProvider?.id) {
                    console.error('No data provider selected');
                    return;
                }

                const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;
                let csvUrl = `${baseUrl}/internal/data-providers/${selectedDataProvider.id}/issues`;

                if (type) {
                    csvUrl += `?type=${type}&accept=text/csv`;
                } else {
                    csvUrl += `?accept=text/csv`;
                }

                const filename = type ? `issues-${type}` : 'issues';
                downloadCsv(csvUrl, filename);
            },
        }),
        {
            name: 'indexing-store',
        }
    )
);

