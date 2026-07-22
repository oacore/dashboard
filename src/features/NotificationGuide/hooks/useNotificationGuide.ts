import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useNotificationGuideStore } from '../store/notificationGuideStore';
import { useNotifications } from '@features/Settings/NotificationsSettings/hooks/useNotifications';
import notificationText from '@features/Settings/texts';
import { useDashboardRoute } from '@hooks/useDashboardRoute';
import { captureHandledError } from '@/utils/captureHandledError';

export const useNotificationGuide = (isLoading: boolean, isError: boolean) => {
  const navigate = useNavigate();
  const { buildPath } = useDashboardRoute();
  const { user } = useAuthStore();
  const { openModal, closeModal, shouldAutoOpen } = useNotificationGuideStore();

  const organisationId = user?.organisationId;
  const userId = user?.id || '';

  // Hooks for fetching notifications
  const harvestingHook = useNotifications({
    userId,
    organisationId,
    type: 'harvest-completed',
    enabled: !!userId && organisationId !== undefined,
  });

  const deduplicationHook = useNotifications({
    userId,
    organisationId,
    type: 'deduplication-completed',
    enabled: !!userId && organisationId !== undefined,
  });

  const notificationConfigs = useMemo(
    () => [
      {
        type: 'harvest-completed' as const,
        key: 'harvesting' as const,
        textConfig: notificationText.notifications.types.harvesting,
      },
      {
        type: 'deduplication-completed' as const,
        key: 'deduplication' as const,
        textConfig: notificationText.notifications.types.deduplication,
      },
    ],
    []
  );

  const notificationHooks = useMemo(
    () => ({
      harvesting: harvestingHook,
      deduplication: deduplicationHook,
    }),
    [harvestingHook, deduplicationHook]
  );

  // Auto-open notification guide modal on mount if needed
  useEffect(() => {
    if (shouldAutoOpen() && !isLoading && !isError) {
      openModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isError]);

  const handleButtonClose = useCallback(() => {
    closeModal();
    navigate(buildPath('notifications'));
  }, [closeModal, navigate, buildPath]);

  // Handle button click - enable all notifications (same as handleToggle in NotificationFeature)
  const handleButtonClick = useCallback(async () => {
    if (organisationId === undefined || harvestingHook.isLoading || deduplicationHook.isLoading) {
      return;
    }

    try {
      // Check current notification states - only enable those that are disabled
      const harvestingData = harvestingHook.data;
      const deduplicationData = deduplicationHook.data;

      const harvestingItem = Array.isArray(harvestingData)
        ? harvestingData.find(item => item.type === 'harvest-completed')
        : null;

      const deduplicationItem = Array.isArray(deduplicationData)
        ? deduplicationData.find(item => item.type === 'deduplication-completed')
        : null;

      const notificationStates = {
        harvesting: !!harvestingItem,
        deduplication: !!deduplicationItem,
      };

      // Only enable notifications that are currently disabled (same as handleToggle)
      const updatePromises = notificationConfigs
        .filter(config => !notificationStates[config.key])
        .map(config =>
          notificationHooks[config.key]
            .updateNotifications({
              organisationId,
              type: config.type,
              datetimeInterval: config.textConfig.radio[0].key,
            })
        );

      await Promise.all(updatePromises);
      closeModal();
      navigate(buildPath('notifications'));
    } catch (error) {
      console.error('Error enabling notifications:', error);
      captureHandledError(error, {
        tags: { feature: 'notification_guide', action: 'enable_notifications' },
        extra: { organisationId },
      });
    }
  }, [
    organisationId,
    harvestingHook.isLoading,
    harvestingHook.data,
    deduplicationHook.isLoading,
    deduplicationHook.data,
    notificationConfigs,
    notificationHooks,
    closeModal,
    navigate,
    buildPath,
  ]);

  return {
    handleButtonClose,
    handleButtonClick,
  };
};

