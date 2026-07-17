import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FairCertificationStore {
  registeredInterestByProvider: Record<number, boolean>;
  grantApprovedAccess: (dataProviderId: number) => void;
  hasRegisteredInterest: (dataProviderId: number) => boolean;
}

export const useFairCertificationStore = create<FairCertificationStore>()(
  persist(
    (set, get) => ({
      registeredInterestByProvider: {},

      grantApprovedAccess: (dataProviderId) => {
        set((state) => ({
          registeredInterestByProvider: {
            ...state.registeredInterestByProvider,
            [dataProviderId]: true,
          },
        }));
      },

      hasRegisteredInterest: (dataProviderId) =>
        Boolean(get().registeredInterestByProvider[dataProviderId]),
    }),
    { name: 'fair-certification-store' },
  ),
);
