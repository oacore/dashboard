import { useState } from 'react';
import useSWR from 'swr';
import { fetcher, createSWRKey, swrDefaultConfig } from '@/config/swr';
import { http } from '@/config/axios';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { captureHandledError } from '@/utils/captureHandledError';

interface NotificationItem {
  id: string;
  type: 'harvest-completed' | 'harvest-failed' | 'duplicates';
  createdDate: string;
  readStatus: boolean;
  dataProviderId?: number;
  [key: string]: unknown;
}

interface UseNotificationParams {
  userId: string | null;
  enabled?: boolean;
}

export const useNotification = ({ userId, enabled = true }: UseNotificationParams) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { isLoaded } = useDataProviderStore();

  // Only fetch when userId is available, data providers are loaded, and enabled is true
  const key =
    enabled && userId && isLoaded
      ? createSWRKey(`/internal/notifications/${userId}`)
      : null;

  const { data, error, isLoading, mutate } = useSWR<NotificationItem[]>(
    key,
    key ? () => fetcher(key).then((res) => res as NotificationItem[]) : null,
    swrDefaultConfig,
  );

  const markNotificationAsRead = async (
    notificationId: string,
  ) => {
    if (!userId) {
      throw new Error('User ID is required');
    }

    setIsUpdating(true);

    try {
      await http.patch(
        `/internal/notifications/${userId}`,
        {
          notification_id: notificationId,
        },
        {
          withCredentials: true,
        }
      );

      // Revalidate the SWR cache to fetch updated data
      await mutate();
    } catch (networkOrAccessError) {
      console.error('Error marking notification as read:', networkOrAccessError);
      captureHandledError(networkOrAccessError, {
        tags: { feature: 'notifications', action: 'mark_read' },
        extra: { userId, notificationId },
      });
      const errorMessage =
        networkOrAccessError instanceof Error
          ? networkOrAccessError.message
          : 'Failed to mark notification as read';
      throw new Error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    notifications: data || [],
    error,
    isLoading: isLoading || isUpdating || !isLoaded,
    mutate,
    markNotificationAsRead,
    isError: !!error,
    isEmpty: !isLoading && !error && (!data || data.length === 0),
  };
};

