import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface IndexingStoreState {
    selectedArticleId: string | null;
}

interface IndexingActions {
    setSelectedArticleId: (id: string | null) => void;
}

type IndexingStore = IndexingStoreState & IndexingActions;

export const useIndexingStore = create<IndexingStore>()(
    devtools(
        (set) => ({
            selectedArticleId: null,

            setSelectedArticleId: (id) => set({ selectedArticleId: id }),
        }),
        { name: 'indexing-store' }
    )
);
