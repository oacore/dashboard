import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type {
  FreshFindsDepositFilter,
  FreshFindsRepositoryStatus,
  FreshFindsWorkItem,
} from '../types/data.types';

interface FreshFindsActions {
  setSearchTerm: (term: string) => void;
  setDepositFilter: (filters: FreshFindsDepositFilter[]) => void;
  setCurrentPage: (page: number) => void;
  setAllData: (data: FreshFindsWorkItem[]) => void;
  appendData: (data: FreshFindsWorkItem[]) => void;
  updateWorkStatus: (workId: number, status: FreshFindsRepositoryStatus) => void;
  setTotalLength: (length: number) => void;
  setHasMore: (hasMore: boolean) => void;
  setIsLoadingMore: (loading: boolean) => void;
  resetDataState: () => void;
  updateLastParams: (
    searchTerm: string,
    dataProviderId: number,
    depositFilter: FreshFindsDepositFilter[],
  ) => void;
  requestSettingsAttention: () => void;
}

export interface FreshFindsStoreState {
  searchTerm: string;
  depositFilter: FreshFindsDepositFilter[];
  currentPage: number;
  allData: FreshFindsWorkItem[];
  totalLength: number;
  hasMore: boolean;
  lastSearchTerm: string;
  lastDepositFilter: FreshFindsDepositFilter[];
  lastDataProviderId: number;
  isLoadingMore: boolean;
  settingsAttentionRequestId: number;
}

type FreshFindsStore = FreshFindsStoreState & FreshFindsActions;

export const useFreshFindsStore = create<FreshFindsStore>()(
  devtools(
    (set, get) => ({
      searchTerm: '',
      depositFilter: [],
      currentPage: 1,
      allData: [],
      totalLength: 0,
      hasMore: false,
      lastSearchTerm: '',
      lastDepositFilter: [],
      lastDataProviderId: 0,
      isLoadingMore: false,
      settingsAttentionRequestId: 0,

      setSearchTerm: (term: string) => {
        set({ searchTerm: term, currentPage: 1 });
      },

      setDepositFilter: (filters: FreshFindsDepositFilter[]) => {
        set({ depositFilter: filters, currentPage: 1 });
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

      updateWorkStatus: (workId: number, status: FreshFindsRepositoryStatus) => {
        const { allData } = get();
        set({
          allData: allData.map((item) =>
            item.workId === workId ? { ...item, status } : item,
          ),
        });
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

      updateLastParams: (
        searchTerm: string,
        dataProviderId: number,
        depositFilter: FreshFindsDepositFilter[],
      ) => {
        set({
          lastSearchTerm: searchTerm,
          lastDepositFilter: depositFilter,
          lastDataProviderId: dataProviderId,
        });
      },

      requestSettingsAttention: () => {
        set({ settingsAttentionRequestId: get().settingsAttentionRequestId + 1 });
      },
    }),
    {
      name: 'fresh-finds-store',
    },
  ),
);
