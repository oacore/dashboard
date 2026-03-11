import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface PublicReleaseDatesItem {
  id: string;
  oai: string;
  title: string;
  authors?: Array<{ name: string }>;
  publicationDate?: string;
  publicationDateMatchingLevel?: 'full' | 'partial' | 'none';
  publicReleaseDate?: string;
}

interface PublicReleaseDatesActions {
  setSearchTerm: (term: string) => void;
  setSortField: (field: string | null) => void;
  setSortOrder: (order: 'asc' | 'desc' | null) => void;
  handleSort: (field: string, order: 'asc' | 'desc' | null) => void;
  setCurrentPage: (page: number) => void;
  setAllData: (data: PublicReleaseDatesItem[]) => void;
  appendData: (data: PublicReleaseDatesItem[]) => void;
  setIsLoadingMore: (loading: boolean) => void;
  resetDataState: () => void;
  resetOnPageEnter: () => void;
}

export interface PublicReleaseDatesStoreState {
  searchTerm: string;
  sortField: string | null;
  sortOrder: 'asc' | 'desc' | null;
  currentPage: number;
  allData: PublicReleaseDatesItem[];
  isLoadingMore: boolean;
}

type PublicReleaseDatesStore = PublicReleaseDatesStoreState & PublicReleaseDatesActions;

export const usePublicReleaseDatesStore = create<PublicReleaseDatesStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      searchTerm: '',
      sortField: 'publicReleaseDate',
      sortOrder: 'desc',
      currentPage: 0,
      allData: [],
      isLoadingMore: false,

      // Actions
      setSearchTerm: (term: string) => {
        set({ searchTerm: term, currentPage: 0 });
      },

      setSortField: (field: string | null) => {
        set({ sortField: field });
      },

      setSortOrder: (order: 'asc' | 'desc' | null) => {
        set({ sortOrder: order });
      },

      handleSort: (field: string, order: 'asc' | 'desc' | null) => {
        const newOrder = order || 'desc';
        set({
          sortField: field,
          sortOrder: newOrder,
          currentPage: 0,
        });
      },

      setCurrentPage: (page: number) => {
        set({ currentPage: page });
      },

      setAllData: (data: PublicReleaseDatesItem[]) => {
        set({ allData: data });
      },

      appendData: (data: PublicReleaseDatesItem[]) => {
        const { allData } = get();
        set({ allData: [...allData, ...data] });
      },

      setIsLoadingMore: (loading: boolean) => {
        set({ isLoadingMore: loading });
      },

      resetDataState: () => {
        set({
          currentPage: 0,
          allData: [],
          isLoadingMore: false,
        });
      },

      resetOnPageEnter: () => {
        set({
          searchTerm: '',
          currentPage: 0,
          allData: [],
          isLoadingMore: false,
        });
      },
    }),
    {
      name: 'public-release-dates-store',
    }
  )
);
