import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type NotificationType = 'harvest-completed' | 'deduplication-completed';

export interface NotificationData {
  type?: 'harvest-completed' | 'deduplication-completed';
  datetimeInterval?: string;
  [key: string]: unknown;
}

export interface NotificationSettings {
  data?: NotificationData[];
  enabled?: boolean;
  // frequency?: 'daily' | 'weekly' | 'monthly';
  datetimeInterval?: string;
  type?: 'harvest-completed' | 'deduplication-completed';
  [key: string]: unknown;
}

interface NotificationsState {
  harvestNotifications: NotificationData[] | NotificationSettings | null;
  deduplicationNotifications: NotificationData[] | NotificationSettings | null;
  isLoading: boolean;
  error: string | null;
}

interface NotificationsActions {
  setHarvestNotifications: (notifications: NotificationData[] | NotificationSettings | null) => void;
  setDeduplicationNotifications: (notifications: NotificationData[] | NotificationSettings | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type NotificationsStore = NotificationsState & NotificationsActions;

export const useNotificationsStore = create<NotificationsStore>()(
  devtools(
    (set) => ({
      // Initial state
      harvestNotifications: null,
      deduplicationNotifications: null,
      isLoading: false,
      error: null,

      // Actions
      setHarvestNotifications: (notifications) => {
        set({ harvestNotifications: notifications });
      },

      setDeduplicationNotifications: (notifications) => {
        set({ deduplicationNotifications: notifications });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'notifications-store',
    }
  )
);

