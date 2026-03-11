import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ContentData } from '@features/Content/types/data.types';

interface ContentActions {
  setSearchTerm: (term: string) => void;
  setSortField: (field: string | null) => void;
  setSortOrder: (order: 'asc' | 'desc' | null) => void;
  resetPagination: () => void;
  handleSort: (field: string, order: 'asc' | 'desc' | null) => void;
  setCurrentPage: (page: number) => void;
  setAllData: (data: ContentData[]) => void;
  appendData: (data: ContentData[]) => void;
  setTotalLength: (length: number) => void;
  setIsLoadingMore: (loading: boolean) => void;
  resetDataState: () => void;
  resetOnPageEnter: () => void;
  updateLastParams: (searchTerm: string, dataProviderId: number, sortField: string | null, sortOrder: 'asc' | 'desc' | null) => void;
  updateWorkVisibility: (id: string, disabled: boolean) => void;
}

export interface ContentStoreState {
  searchTerm: string;
  sortField: string | null;
  sortOrder: 'asc' | 'desc' | null;
  currentPage: number;
  allData: ContentData[];
  totalLength: number;
  lastSearchTerm: string;
  lastDataProviderId: number;
  lastSortField: string | null;
  lastSortOrder: 'asc' | 'desc' | null;
  isLoadingMore: boolean;
}

type ContentStore = ContentStoreState & ContentActions;

export const useContentTableStore = create<ContentStore>()(
  devtools(
    (set, get) => ({
      // Initial state - set default sorting to lastUpdate:desc
      searchTerm: '',
      sortField: 'lastUpdate',
      sortOrder: 'desc',
      currentPage: 0,
      allData: [],
      totalLength: 0,
      lastSearchTerm: '',
      lastDataProviderId: 0,
      lastSortField: 'lastUpdate',
      lastSortOrder: 'desc',
      isLoadingMore: false,

      // Actions
      setSearchTerm: (term: string) => {
        set({ searchTerm: term, currentPage: 0 }); // Reset pagination on search
      },

      setSortField: (field: string | null) => {
        set({ sortField: field });
      },

      setSortOrder: (order: 'asc' | 'desc' | null) => {
        set({ sortOrder: order });
      },

      // Simplified handleSort since CrTable now handles the cycling
      handleSort: (field: string, order: 'asc' | 'desc' | null) => {
        // Only allow sorting on lastUpdate field
        if (field !== 'lastUpdate') {
          return;
        }

        // Since CrTable now prevents null orders, we can directly use the order
        const newOrder = order || 'desc'; // Fallback to desc if somehow null

        set({
          sortField: field,
          sortOrder: newOrder,
          currentPage: 0 // Reset pagination when sorting changes
        });
      },

      resetPagination: () => {
        set({ currentPage: 0 });
      },

      // New actions
      setCurrentPage: (page: number) => {
        set({ currentPage: page });
      },

      setAllData: (data: ContentData[]) => {
        set({ allData: data });
      },

      appendData: (data: ContentData[]) => {
        const { allData } = get();
        set({ allData: [...allData, ...data] });
      },

      setTotalLength: (length: number) => {
        set({ totalLength: length });
      },

      setIsLoadingMore: (loading: boolean) => {
        set({ isLoadingMore: loading });
      },

      resetDataState: () => {
        set({
          currentPage: 0,
          allData: [],
          totalLength: 0,
          isLoadingMore: false
        });
      },

      resetOnPageEnter: () => {
        set({
          searchTerm: '',
          currentPage: 0,
          allData: [],
          totalLength: 0,
          isLoadingMore: false,
          lastSearchTerm: '',
        });
      },

      updateLastParams: (searchTerm: string, dataProviderId: number, sortField: string | null, sortOrder: 'asc' | 'desc' | null) => {
        set({
          lastSearchTerm: searchTerm,
          lastDataProviderId: dataProviderId,
          lastSortField: sortField,
          lastSortOrder: sortOrder
        });
      },

      updateWorkVisibility: (id: string, disabled: boolean) => {
        const { allData } = get();
        const updatedData = allData.map(item =>
          item.id === Number(id) ? { ...item, disabled } : item
        );
        set({ allData: updatedData });
      },
    }),
    {
      name: 'content-table-store',
    }
  )
);
