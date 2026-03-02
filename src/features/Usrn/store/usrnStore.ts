import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type UsrnData = Record<string, unknown>;

interface UsrnStoreState {
  usrnData: UsrnData | null;
  error: string | null;
  isLoading: boolean;
}

interface UsrnStoreActions {
  setUsrnData: (usrnData: UsrnData | null) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}

type UsrnStore = UsrnStoreState & UsrnStoreActions;

export const useUsrnStore = create<UsrnStore>()(
  devtools(
    (set) => ({
      usrnData: null,
      error: null,
      isLoading: false,

      setUsrnData: (usrnData) => set({ usrnData }),
      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    { name: 'usrn-store' }
  )
);
