import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { FreshFindsWorkItem } from '../types/data.types';

interface FreshFindsActions {
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
  setAllData: (data: FreshFindsWorkItem[]) => void;
  appendData: (data: FreshFindsWorkItem[]) => void;
  setTotalLength: (length: number) => void;
  setHasMore: (hasMore: boolean) => void;
  setIsLoadingMore: (loading: boolean) => void;
  resetDataState: () => void;
  updateLastParams: (searchTerm: string, dataProviderId: number) => void;
}

export interface FreshFindsStoreState {
  searchTerm: string;
  currentPage: number;
  allData: FreshFindsWorkItem[];
  totalLength: number;
  hasMore: boolean;
  lastSearchTerm: string;
  lastDataProviderId: number;
  isLoadingMore: boolean;
}

type FreshFindsStore = FreshFindsStoreState & FreshFindsActions;

export const useFreshFindsStore = create<FreshFindsStore>()(
  devtools(
    (set, get) => ({
      searchTerm: '',
      currentPage: 1,
      allData: [],
      totalLength: 0,
      hasMore: false,
      lastSearchTerm: '',
      lastDataProviderId: 0,
      isLoadingMore: false,

      setSearchTerm: (term: string) => {
        set({ searchTerm: term, currentPage: 1 });
      },

      setCurrentPage: (page: number) => {
        set({ currentPage: page });
      },

      setAllData: (data: FreshFindsWorkItem[]) => {
        set({ allData: data });
      },

      appendData: (data: FreshFindsWorkItem[]) => {
        const { allData } = get();
        set({ allData: [...allData, ...data] });
      },

      setTotalLength: (length: number) => {
        set({ totalLength: length });
      },

      setHasMore: (hasMore: boolean) => {
        set({ hasMore });
      },

      setIsLoadingMore: (loading: boolean) => {
        set({ isLoadingMore: loading });
      },

      resetDataState: () => {
        set({
          currentPage: 1,
          allData: [],
          totalLength: 0,
          hasMore: false,
          isLoadingMore: false,
        });
      },

      updateLastParams: (searchTerm: string, dataProviderId: number) => {
        set({
          lastSearchTerm: searchTerm,
          lastDataProviderId: dataProviderId,
        });
      },
    }),
    {
      name: 'fresh-finds-store',
    },
  ),
);
