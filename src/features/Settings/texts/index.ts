import notificationText from './notifications.json';

export type NotificationText = typeof notificationText & {
  sets: { title: string; description: string };
};

export default notificationText as NotificationText;

