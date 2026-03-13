import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface NotificationGuideState {
  isModalOpen: boolean;
}

interface NotificationGuideActions {
  openModal: () => void;
  closeModal: () => void;
  shouldAutoOpen: () => boolean;
}

type NotificationGuideStore = NotificationGuideState & NotificationGuideActions;

export const useNotificationGuideStore = create<NotificationGuideStore>()(
  devtools(
    (set) => ({
      isModalOpen: false,

      openModal: () => {
        set({ isModalOpen: true });
      },

      closeModal: () => {
        localStorage.setItem('notificationGuideSeen', 'true');
        set({ isModalOpen: false });
      },

      shouldAutoOpen: () => {
        const notificationGuideSeen = localStorage.getItem('notificationGuideSeen');
        return notificationGuideSeen !== 'true';
      },
    }),
    {
      name: 'notification-guide-store',
    }
  )
);

