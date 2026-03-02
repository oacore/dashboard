import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface InviteItem {
  email: string;
  activated: boolean;
  code?: string;
}

export interface BillingPlan {
  billingType?: string | null;
}

export interface OrganisationData {
  name?: string;
  rorId?: string;
  rorName?: string;
  billingPlan?: BillingPlan;
}

interface OrganisationState {
  organisation: OrganisationData | null;
  inviteCodes: InviteItem[];
  isLoadingOrganisation: boolean;
  isLoadingInvites: boolean;
  isInviting: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
  error: string | null;
}

interface OrganisationActions {
  setOrganisation: (organisation: OrganisationData | null) => void;
  setInviteCodes: (inviteCodes: InviteItem[]) => void;
  setLoadingOrganisation: (loading: boolean) => void;
  setLoadingInvites: (loading: boolean) => void;
  setInviting: (inviting: boolean) => void;
  setDeleting: (deleting: boolean) => void;
  setUpdating: (updating: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type OrganisationStore = OrganisationState & OrganisationActions;

export const useOrganisationStore = create<OrganisationStore>()(
  devtools(
    (set) => ({
      // Initial state
      organisation: null,
      inviteCodes: [],
      isLoadingOrganisation: false,
      isLoadingInvites: false,
      isInviting: false,
      isDeleting: false,
      isUpdating: false,
      error: null,

      // Actions
      setOrganisation: (organisation) => {
        set({ organisation });
      },

      setInviteCodes: (inviteCodes) => {
        set({ inviteCodes });
      },

      setLoadingOrganisation: (isLoadingOrganisation) => {
        set({ isLoadingOrganisation });
      },

      setLoadingInvites: (isLoadingInvites) => {
        set({ isLoadingInvites });
      },

      setInviting: (isInviting) => {
        set({ isInviting });
      },

      setDeleting: (isDeleting) => {
        set({ isDeleting });
      },

      setUpdating: (isUpdating) => {
        set({ isUpdating });
      },

      setError: (error) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'organisation-store',
    }
  )
);

