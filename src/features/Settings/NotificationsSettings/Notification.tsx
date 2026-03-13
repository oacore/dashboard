import { NotificationCard } from '@features/Settings/NotificationsSettings/components/NotificationCard.tsx';
import { CrPaper } from '@oacore/core-ui';
import notificationText from '@features/Settings/texts';
import classNames from 'classnames';
import notification from '@/assets/icons/notification.svg';
import notificationOff from '@/assets/icons/notificationsOffs.svg';
import deduplication from '@/assets/icons/deduplicationStatus.svg';
import harvesting from '@/assets/icons/harvestingStatus.svg';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore.ts';
import { useNotifications } from '@features/Settings/NotificationsSettings/hooks/useNotifications.ts';
import { useNotificationsStore } from '@features/Settings/NotificationsSettings/store/notificationsStore.ts';
import type { RadioChangeEvent } from 'antd';
import "./styles.css"

type NotificationType = 'harvest-completed' | 'deduplication-completed';

interface NotificationConfig {
  type: NotificationType;
  key: 'harvesting' | 'deduplication';
  textConfig: typeof notificationText.notifications.types.harvesting;
  image: string;
}

export const NotificationFeature = () => {
  const { user } = useAuthStore();
  const { harvestNotifications, deduplicationNotifications } = useNotificationsStore();

  const organisationId = user?.organisationId;
  const userId = user?.id || '';

  const notificationConfigs: NotificationConfig[] = useMemo(
    () => [
      {
        type: 'harvest-completed',
        key: 'harvesting',
        textConfig: notificationText.notifications.types.harvesting,
        image: harvesting,
      },
      {
        type: 'deduplication-completed',
        key: 'deduplication',
        textConfig: notificationText.notifications.types.deduplication,
        image: deduplication,
      },
    ],
    []
  );

  // State management - using object to reduce duplication
  const [notificationStates, setNotificationStates] = useState({
    harvesting: {
      switch: false,
      selectedOption: notificationText.notifications.types.harvesting.radio[0].key,
    },
    deduplication: {
      switch: false,
      selectedOption: notificationText.notifications.types.deduplication.radio[0].key,
    },
  });

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

  const notificationHooks = useMemo(
    () => ({
      harvesting: harvestingHook,
      deduplication: deduplicationHook,
    }),
    [harvestingHook, deduplicationHook]
  );

  // Set switch states based on fetched data - unified logic for both types
  useEffect(() => {
    const harvestingData = harvestingHook.data || harvestNotifications;
    const deduplicationData = deduplicationHook.data || deduplicationNotifications;

    const harvestingItem = Array.isArray(harvestingData)
      ? harvestingData.find(item => item.type === 'harvest-completed')
      : null;

    const deduplicationItem = Array.isArray(deduplicationData)
      ? deduplicationData.find(item => item.type === 'deduplication-completed')
      : null;

    setNotificationStates(prev => ({
      harvesting: {
        switch: !!harvestingItem,
        selectedOption: harvestingItem?.datetimeInterval || prev.harvesting.selectedOption,
      },
      deduplication: {
        switch: !!deduplicationItem,
        selectedOption: deduplicationItem?.datetimeInterval || prev.deduplication.selectedOption,
      },
    }));
  }, [
    harvestingHook.data,
    deduplicationHook.data,
    harvestNotifications,
    deduplicationNotifications,
  ]);

  // Create handlers for each notification type
  const createOptionChangeHandler = useCallback(
    (key: 'harvesting' | 'deduplication', config: NotificationConfig) => {
      return async (e: RadioChangeEvent) => {
        const newSelectedOption = e.target.value;
        setNotificationStates(prev => ({
          ...prev,
          [key]: { ...prev[key], selectedOption: newSelectedOption },
        }));

        if (organisationId === undefined) return;

        try {
          await notificationHooks[key].updateNotifications({
            organisationId,
            type: config.type,
            datetimeInterval: newSelectedOption,
          });
        } catch (error) {
          console.error(`Error updating ${key} notifications:`, error);
        }
      };
    },
    [organisationId, notificationHooks]
  );

  const createToggleHandler = useCallback(
    (key: 'harvesting' | 'deduplication', config: NotificationConfig) => {
      return async () => {
        if (organisationId === undefined) return;

        const currentSwitch = notificationStates[key].switch;
        const newSwitch = !currentSwitch;

        setNotificationStates(prev => ({
          ...prev,
          [key]: { ...prev[key], switch: newSwitch },
        }));

        try {
          if (newSwitch) {
            await notificationHooks[key].updateNotifications({
              organisationId,
              type: config.type,
              datetimeInterval: config.textConfig.radio[0].key,
            });
            setNotificationStates(prev => ({
              ...prev,
              [key]: {
                switch: true,
                selectedOption: config.textConfig.radio[0].key,
              },
            }));
          } else {
            await notificationHooks[key].deleteNotifications({
              organisationId,
              type: config.type,
            });
          }
        } catch (error) {
          console.error(`Error toggling ${key} notifications:`, error);
          setNotificationStates(prev => ({
            ...prev,
            [key]: { ...prev[key], switch: !newSwitch },
          }));
        }
      };
    },
    [organisationId, notificationHooks, notificationStates]
  );

  const handlers = useMemo(
    () => ({
      harvesting: {
        optionChange: createOptionChangeHandler('harvesting', notificationConfigs[0]),
        toggle: createToggleHandler('harvesting', notificationConfigs[0]),
      },
      deduplication: {
        optionChange: createOptionChangeHandler('deduplication', notificationConfigs[1]),
        toggle: createToggleHandler('deduplication', notificationConfigs[1]),
      },
    }),
    [createOptionChangeHandler, createToggleHandler, notificationConfigs]
  );

  const isLoading = harvestingHook.isLoading || deduplicationHook.isLoading;
  const hasAnyActive = notificationStates.harvesting.switch || notificationStates.deduplication.switch;

  // Handle delete all notifications - run requests in parallel
  const handleDelete = useCallback(async () => {
    if (organisationId === undefined || isLoading) return;

    try {
      const deletePromises = notificationConfigs
        .filter(config => notificationStates[config.key].switch)
        .map(config =>
          notificationHooks[config.key]
            .deleteNotifications({
              organisationId,
              type: config.type,
            })
            .then(() => {
              setNotificationStates(prev => ({
                ...prev,
                [config.key]: { ...prev[config.key], switch: false },
              }));
            })
        );

      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting notifications:', error);
    }
  }, [organisationId, isLoading, notificationConfigs, notificationStates, notificationHooks]);

  // Handle toggle all notifications - run requests in parallel
  const handleToggle = useCallback(async () => {
    if (organisationId === undefined || isLoading) return;

    try {
      const updatePromises = notificationConfigs
        .filter(config => !notificationStates[config.key].switch)
        .map(config =>
          notificationHooks[config.key]
            .updateNotifications({
              organisationId,
              type: config.type,
              datetimeInterval: config.textConfig.radio[0].key,
            })
            .then(() => {
              setNotificationStates(prev => ({
                ...prev,
                [config.key]: {
                  switch: true,
                  selectedOption: config.textConfig.radio[0].key,
                },
              }));
            })
        );

      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error toggling notifications:', error);
    }
  }, [organisationId, isLoading, notificationConfigs, notificationStates, notificationHooks]);

  return (
    <CrPaper>
      <div className="header-wrapper">
        <h2 className="header-wrapper-title">{notificationText.notifications.title}</h2>
        {hasAnyActive ? (
          <div
            onClick={isLoading ? undefined : handleDelete}
            className={classNames("notification-wrapper", {
              'disabled': isLoading,
            })}
          >
            <img src={notification} alt={notificationText.notifications.title} />
            <span
              className={classNames("notification-text", {
                "disabled": isLoading,
              })}
            >
              {notificationText.notifications.subAction}
            </span>
          </div>
        ) : (
          <div
            onClick={isLoading ? undefined : handleToggle}
            className={classNames("notification-wrapper", {
              'disabled': isLoading,
            })}
          >
            <img src={notificationOff} alt={notificationText.notifications.title} />
            <span className="notification-text-disable">
              {notificationText.notifications.subActionDisabled}
            </span>
          </div>
        )}
      </div>
      <p className="header-sub-title">
        {notificationText.notifications.subTitle}
      </p>
      <div className="main-wrapper">
        {notificationConfigs.map(config => {
          const state = notificationStates[config.key];
          const hook = notificationHooks[config.key];
          const handler = handlers[config.key];

          return (
            <NotificationCard
              key={config.key}
              type={config.key}
              label={
                <span className="switch-title">
                  {config.textConfig.type}
                </span>
              }
              title={config.textConfig.notifyOne}
              options={config.textConfig.radio}
              checked={state.switch}
              onChange={handler.toggle}
              id={config.key}
              name={config.key}
              handleOptionChange={handler.optionChange}
              updateNotificationsPending={hook.isLoading}
              notificationsPending={hook.isLoading}
              image={config.image}
              selectedOption={state.selectedOption}
            />
          );
        })}
      </div>
    </CrPaper>
  )
}
