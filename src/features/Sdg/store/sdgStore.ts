import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface SdgActions {
    setSearchTerm: (term: string) => void;
    setSortField: (field: string | null) => void;
    setSortOrder: (order: 'asc' | 'desc' | null) => void;
    handleSort: (field: string, order: 'asc' | 'desc' | null) => void;
    setSelectedArticleId: (id: string | null) => void;
    setDateRange: (startDate: string, endDate: string) => void;
    setIsGeneratingReport: (isLoading: boolean) => void;
    setReportGenerationError: (error: string | null) => void;
    setLastGeneratedReportId: (dataProviderId: number | null) => void;
    getReportGenerated: (dataProviderId: number) => boolean;
    clearReportError: () => void;
    resetOnPageEnter: () => void;
}

export interface SdgStoreState {
    searchTerm: string;
    sortField: string | null;
    sortOrder: 'asc' | 'desc' | null;
    selectedArticleId: string | null;
    dateRange: {
        startDate: string;
        endDate: string;
    };
    isGeneratingReport: boolean;
    reportGenerationError: string | null;
    lastGeneratedReportId: number | null;
}

type SdgStore = SdgStoreState & SdgActions;

export const useSdgTableStore = create<SdgStore>()(
    devtools(
        (set) => ({
            // Initial state
            searchTerm: '',
            sortField: null,
            sortOrder: null,
            selectedArticleId: null,
            dateRange: {
                startDate: '2012',
                endDate: String(new Date().getFullYear()),
            },
            isGeneratingReport: false,
            reportGenerationError: null,
            lastGeneratedReportId: null,

            // Actions
            setSearchTerm: (term: string) => {
                set({ searchTerm: term });
            },

            setSortField: (field: string | null) => {
                set({ sortField: field });
            },

            setSortOrder: (order: 'asc' | 'desc' | null) => {
                set({ sortOrder: order });
            },

            handleSort: (field: string, order: 'asc' | 'desc' | null) => {
                set({
                    sortField: field,
                    sortOrder: order,
                });
            },

            setSelectedArticleId: (id: string | null) => {
                set({ selectedArticleId: id });
            },

            setDateRange: (startDate: string, endDate: string) => {
                set({
                    dateRange: {
                        startDate,
                        endDate,
                    },
                });
            },

            setIsGeneratingReport: (isLoading: boolean) => {
                set({ isGeneratingReport: isLoading });
            },

            setReportGenerationError: (error: string | null) => {
                set({ reportGenerationError: error });
            },

            setLastGeneratedReportId: (dataProviderId: number | null) => {
                set({ lastGeneratedReportId: dataProviderId });
            },

            getReportGenerated: (dataProviderId: number) => {
                if (!dataProviderId) return false;
                const stored = localStorage.getItem(`reportGenerated_${dataProviderId}`);
                return stored ? JSON.parse(stored) : false;
            },

            clearReportError: () => {
                set({ reportGenerationError: null });
            },

            resetOnPageEnter: () => {
                set({
                    searchTerm: '',
                    sortField: null,
                    sortOrder: null,
                    selectedArticleId: null,
                    dateRange: {
                        startDate: '2012',
                        endDate: String(new Date().getFullYear()),
                    },
                });
            },
        }),
        {
            name: 'sdg-table-store',
        }
    )
);

