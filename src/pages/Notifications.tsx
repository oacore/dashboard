import { useDocumentTitle } from '@hooks/useDocumentTitle';
import {NotificationFeature} from '@features/Settings/NotificationsSettings/Notification.tsx';

export function NotificationsPage() {
  useDocumentTitle('Notifications');

  return (
    <NotificationFeature/>
  );
}
