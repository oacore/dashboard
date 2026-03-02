import { useState } from 'react';
import useSWR from 'swr';
import { fetcher, createSWRKey, postRequestFetcher } from '@config/swr.ts';
import { http } from '@config/axios.ts';
import { useAuthStore } from '@/store/authStore.ts';
import {
  useNotificationsStore,
  type NotificationType,
  type NotificationSettings,
  type NotificationData,
} from '../store/notificationsStore.ts';

interface UseNotificationsParams {
  userId: string;
  organisationId: number | undefined;
  type: NotificationType;
  enabled?: boolean;
}

export const useNotifications = ({
  userId,
  organisationId,
  type,
  enabled = true,
}: UseNotificationsParams) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuthStore();
  const {
    harvestNotifications,
    deduplicationNotifications,
    setHarvestNotifications,
    setDeduplicationNotifications,
    setError,
    clearError,
  } = useNotificationsStore();

  // fetching notifications
  const key =
    enabled && userId && organisationId && user?.id
      ? createSWRKey(`/internal/user/${user.id}/settings/${organisationId}/${type}`)
      : null;

  const { data, error, isLoading, mutate } = useSWR<NotificationData[] | NotificationSettings>(
    key,
    key ? () => fetcher(key).then((res) => res as NotificationData[] | NotificationSettings) : null,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      onSuccess: (responseData) => {
        if (type === 'harvest-completed') {
          setHarvestNotifications(responseData);
        } else if (type === 'deduplication-completed') {
          setDeduplicationNotifications(responseData);
        }
        clearError();
      },
      onError: (err) => {
        console.error('Error fetching notifications:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      },
    }
  );

  const updateNotifications = async (body: {
    organisationId: number;
    type: NotificationType;
    datetimeInterval: string;
    [key: string]: unknown;
  }) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    setIsUpdating(true);
    setError(null);

    try {
      await postRequestFetcher(
        `/internal/user/${user.id}/settings`,
        {
          ...body,
        },
        true
      );

      // Revalidate the SWR cache to fetch updated data
      await mutate();
    } catch (networkOrAccessError) {
      console.error('Error updating notifications:', networkOrAccessError);
      const errorMessage =
        networkOrAccessError instanceof Error
          ? networkOrAccessError.message
          : 'Something went wrong. Please try again later!';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteNotifications = async (body: {
    organisationId: number;
    type: NotificationType;
    [key: string]: unknown;
  }) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    setIsUpdating(true);
    setError(null);

    try {
      await http.delete(`/internal/user/${user.id}/settings`, {
        data: {
          userId: user.id,
          ...body,
        },
        withCredentials: true,
      });

      // Revalidate the SWR cache to fetch updated data
      await mutate();
    } catch (networkOrAccessError) {
      console.error('Error deleting notifications:', networkOrAccessError);
      const errorMessage =
        networkOrAccessError instanceof Error
          ? networkOrAccessError.message
          : 'Something went wrong. Please try again later!';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  // Get the current notification data based on type
  const currentNotifications =
    type === 'harvest-completed' ? harvestNotifications : deduplicationNotifications;

  return {
    data: data || currentNotifications,
    error,
    isLoading: isLoading || isUpdating,
    mutate,
    updateNotifications,
    deleteNotifications,
    isError: !!error,
    isEmpty: !isLoading && !error && !data && !currentNotifications,
  };
};

