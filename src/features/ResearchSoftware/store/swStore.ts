import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { downloadCsv } from '@utils/downloadUtils'
import { useDataProviderStore } from '@/store/dataProviderStore'
import type { SwRow, SwTab } from '../types/sw.types'

interface SwActions {
    setSearchTerm: (term: string) => void
    setSortField: (field: string | null) => void
    setSortOrder: (order: 'asc' | 'desc' | null) => void
    handleSort: (field: string, order: 'asc' | 'desc' | null) => void
    setSelectedArticleId: (id: string | null) => void

    setActiveTab: (tab: SwTab) => void
    downloadCsv: () => void

    setSelectedRow: (row: SwRow | null) => void
    setSidebarOpen: (open: boolean) => void
    closeSidebar: () => void

    setDateRange: (startDate: string, endDate: string) => void
}

export interface SwStoreState {
    searchTerm: string
    sortField: string | null
    sortOrder: 'asc' | 'desc' | null
    selectedArticleId: string | null
    activeTab: SwTab
    isDownloading: boolean

    selectedRow: SwRow | null
    isSidebarOpen: boolean

    dateRange: {
        startDate: string | null
        endDate: string | null
    }
}

type SwStore = SwStoreState & SwActions

const getDefaultDateRange = () => {
    const today = `${new Date().toISOString().split('T')[0]} 00:00:00`
    const defaultStartDate = '2023-01-01 00:00:00'
    return {
        startDate: defaultStartDate,
        endDate: today,
    }
}

export const useSwStore = create<SwStore>()(
    devtools(
        (set) => ({
            // Initial state
            searchTerm: '',
            sortField: null,
            sortOrder: null,
            selectedArticleId: null,
            activeTab: 'ready',
            isDownloading: false,

            selectedRow: null,
            isSidebarOpen: false,

            dateRange: getDefaultDateRange(),

            // Actions
            setSearchTerm: (term: string) => set({ searchTerm: term }),
            setSortField: (field: string | null) => set({ sortField: field }),
            setSortOrder: (order: 'asc' | 'desc' | null) => set({ sortOrder: order }),
            handleSort: (field: string, order: 'asc' | 'desc' | null) =>
                set({ sortField: field, sortOrder: order }),

            setSelectedArticleId: (id: string | null) => set({ selectedArticleId: id }),
            setActiveTab: (tab: SwTab) => set({ activeTab: tab }),


            setSelectedRow: (row: SwRow | null) =>
                set({ selectedRow: row, isSidebarOpen: !!row }),
            setSidebarOpen: (open: boolean) => set({ isSidebarOpen: open }),
            closeSidebar: () => set({ isSidebarOpen: false, selectedRow: null }),

            setDateRange: (startDate: string, endDate: string) =>
                set({
                    dateRange: {
                        startDate,
                        endDate,
                    },
                }),

            downloadCsv: () => {
                const { selectedDataProvider } = useDataProviderStore.getState()

                const baseUrl = import.meta.env.VITE_APP_API_BASE_URL
                const csvUrl = `${baseUrl}/internal/data-providers/${selectedDataProvider?.id}/sw-mentions?accept=text/csv`
                downloadCsv(csvUrl, 'sw-data')
            },
        }),
        { name: 'sw-table-store' }
    )
)
