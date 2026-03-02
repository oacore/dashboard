import useSWR from 'swr';
import { fetcher, postRequestFetcher, patchRequest, deleteRequest } from '@config/swr';
import { useAuthStore } from '@/store/authStore';
import { message } from 'antd';
import axios from 'axios';
import { useEffect } from 'react';
import {
  useOrganisationStore,
  type InviteItem,
  type OrganisationData,
} from '../store/organisationStore';

export interface ApiUserData {
  person?: string;
  email?: string;
  description?: string;
  [key: string]: unknown;
}

export interface DatasetUserData {
  person?: string;
  email?: string;
  description?: string;
  [key: string]: unknown;
}

export const useOrganisation = (options?: { enabled?: boolean }) => {
  const { user } = useAuthStore();
  const {
    organisation,
    inviteCodes,
    isLoadingOrganisation: storeLoadingOrg,
    isLoadingInvites: storeLoadingInvites,
    isInviting: storeInviting,
    isDeleting: storeDeleting,
    isUpdating: storeUpdating,
    error: storeError,
    setOrganisation,
    setInviteCodes,
    setLoadingOrganisation,
    setInviting,
    setDeleting,
    setUpdating,
    setError,
    clearError,
  } = useOrganisationStore();

  const organisationId = user?.organisationId;
  const INVITES_KEY = organisationId
    ? `/internal/organisations/${organisationId}/invitation`
    : null;
  const ORGANISATION_KEY = organisationId
    ? `/internal/organisations/${organisationId}`
    : null;
  const API_USERS_KEY = '/internal/settings/access_api_key';
  const DATASET_USERS_KEY = '/internal/settings/access_dataset';

  const enabled = options?.enabled !== false;

  // Fetch organisation data
  const {
    data: organisationData,
    error: organisationError,
    isLoading: isLoadingOrganisation,
    mutate: mutateOrganisation,
  } = useSWR<OrganisationData>(
    enabled && ORGANISATION_KEY ? ORGANISATION_KEY : null,
    ORGANISATION_KEY ? () => fetcher(ORGANISATION_KEY).then((res) => res as OrganisationData) : null,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        setOrganisation(data);
        clearError();
      },
      onError: (err) => {
        console.error('Error fetching organisation:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch organisation');
      },
    }
  );

  useEffect(() => {
    setLoadingOrganisation(isLoadingOrganisation);
  }, [isLoadingOrganisation, setLoadingOrganisation]);

  // Fetch invites
  const {
    data: invitesData,
    error: invitesError,
    isLoading: isLoadingInvites,
    mutate: mutateInvites,
  } = useSWR<InviteItem[]>(
    INVITES_KEY,
    INVITES_KEY ? () => fetcher(INVITES_KEY).then((res) => {
      // Handle both array response and { data: [...] } response
      if (Array.isArray(res)) {
        return res;
      }
      if (res && typeof res === 'object' && 'data' in res && Array.isArray(res.data)) {
        return res.data;
      }
      return [];
    }) : null,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        setInviteCodes(data);
        clearError();
      },
      onError: (err) => {
        console.error('Error fetching invites:', err);
        setError(err instanceof Error ? err.message : 'Failed to load invites');
        message.error('Failed to load invites');
      },
    }
  );

  // Fetch API users
  const {
    data: apiUsersData,
    error: apiUsersError,
    isLoading: isLoadingApiUsers,
    mutate: mutateApiUsers,
  } = useSWR<ApiUserData[]>(
    API_USERS_KEY,
    () => fetcher(API_USERS_KEY).then((res) => {
      // Handle both array response and { data: [...] } response
      if (Array.isArray(res)) {
        return res as ApiUserData[];
      }
      if (res && typeof res === 'object' && 'data' in res && Array.isArray(res.data)) {
        return res.data as ApiUserData[];
      }
      return [];
    }),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      onError: (err) => {
        // Ignore errors for this moment (as per original implementation)
        console.error('Error fetching API users:', err);
      },
    }
  );

  // Fetch dataset users
  const {
    data: datasetUsersData,
    error: datasetUsersError,
    isLoading: isLoadingDatasetUsers,
    mutate: mutateDatasetUsers,
  } = useSWR<DatasetUserData[]>(
    DATASET_USERS_KEY,
    () => fetcher(DATASET_USERS_KEY).then((res) => {
      // Handle both array response and { data: [...] } response
      if (Array.isArray(res)) {
        return res as DatasetUserData[];
      }
      if (res && typeof res === 'object' && 'data' in res && Array.isArray(res.data)) {
        return res.data as DatasetUserData[];
      }
      return [];
    }),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      onError: (err) => {
        // Ignore errors for this moment (as per original implementation)
        console.error('Error fetching dataset users:', err);
      },
    }
  );

  const inviteUser = async (email: string): Promise<{ message: string; type: 'success' | 'error' }> => {
    if (!organisationId) {
      const errorMsg = 'User organisation not found';
      message.error(errorMsg);
      setError(errorMsg);
      return { message: errorMsg, type: 'error' };
    }

    setInviting(true);
    setError(null);

    try {
      await postRequestFetcher(
        `/internal/organisations/${organisationId}/invitation`,
        { email },
        true
      );

      message.success('Invitation has been sent.');

      return {
        message: 'Invitation has been sent.',
        type: 'success',
      };
    } catch (error) {
      let errorMessage = 'Something went wrong. Please try again later.';
      const type: 'success' | 'error' = 'error';

      if (axios.isAxiosError(error)) {
        // Check for 406 Not Acceptable status
        if (error.response?.status === 406) {
          errorMessage = 'Email for this organisation is already registered.';
        }
      }

      message.error(errorMessage);
      setError(errorMessage);
      return { message: errorMessage, type };
    } finally {
      setInviting(false);
    }
  };

  const deleteInvite = async (item: InviteItem): Promise<void> => {
    if (!organisationId) {
      const errorMsg = 'User organisation not found';
      message.error(errorMsg);
      setError(errorMsg);
      return;
    }

    if (!item.code && !item.email) {
      const errorMsg = 'Invalid invite item';
      message.error(errorMsg);
      setError(errorMsg);
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      // If we have a code, use it; otherwise use email as identifier
      const identifier = item.code || item.email;
      await deleteRequest(`/internal/invitation/${identifier}`, true);

      // Optimistically update the cache
      await mutateInvites(
        (current: InviteItem[] | undefined) => {
          if (!current) return current;
          return current.filter(
            (invite) => invite.email !== item.email && invite.code !== item.code
          );
        },
        { revalidate: true }
      );

      message.success('Invite deleted successfully');
    } catch (error) {
      console.error('Error deleting invite:', error);
      const errorMessage = 'Failed to delete invite';
      message.error(errorMessage);
      setError(errorMessage);
      // Revalidate to get the correct state
      await mutateInvites();
      throw error;
    } finally {
      setDeleting(false);
    }
  };

  const updateOrganization = async (patch: { name?: string; ror_id?: string; rorName?: string }): Promise<{ message: string; type: 'success' | 'error' }> => {
    if (!organisationId) {
      const errorMsg = 'User organisation not found';
      message.error(errorMsg);
      setError(errorMsg);
      return { message: errorMsg, type: 'error' };
    }

    setUpdating(true);
    setError(null);

    try {
      await patchRequest(
        `/internal/organisations/${organisationId}`,
        patch,
        true
      );

      const successMessage = 'Settings were updated successfully!';
      message.success(successMessage);

      return { message: successMessage, type: 'success' };
    } catch (error) {
      console.error('Error updating organisation:', error);
      const errorMessage = 'Something went wrong. Please try again later!';
      message.error(errorMessage);
      setError(errorMessage);
      return { message: errorMessage, type: 'error' };
    } finally {
      setUpdating(false);
    }
  };

  return {
    organisation: organisationData || organisation || ({} as OrganisationData),
    isLoadingOrganisation: isLoadingOrganisation || storeLoadingOrg,
    organisationError: organisationError || storeError,
    inviteCodes: invitesData || inviteCodes || [],
    isLoadingInvites: isLoadingInvites || storeLoadingInvites,
    invitesError: invitesError || storeError,
    isInviting: storeInviting,
    isDeleting: storeDeleting,
    isUpdating: storeUpdating,
    apiUsersData: apiUsersData || [],
    isLoadingApiUsers,
    apiUsersError,
    datasetUsersData: datasetUsersData || [],
    isLoadingDatasetUsers,
    datasetUsersError,
    inviteUser,
    deleteInvite,
    updateOrganization,
    refreshInvites: mutateInvites,
    refreshOrganisation: mutateOrganisation,
    refreshApiUsers: mutateApiUsers,
    refreshDatasetUsers: mutateDatasetUsers,
  };
};
