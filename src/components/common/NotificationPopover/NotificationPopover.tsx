import { Popover, Spin, Button } from 'antd';
import { cloneElement, isValidElement, useState, useCallback, useMemo } from 'react';
import arrows from '@/assets/icons/greenArrowBig.svg';
import success from '@/assets/icons/successHarvesting.svg';
import failIcon from '@/assets/icons/faillHarvesting.svg';
import './styles.css';
import notificationText from '@features/Settings/texts';

interface NotificationItem {
  id: string;
  type: 'harvest-completed' | 'harvest-failed' | 'duplicates';
  createdDate: string;
  readStatus: boolean;
  dataProviderId?: number;
  [key: string]: unknown;
}

interface NotificationPopoverProps {
  children: React.ReactElement;
  handleNotificationClick: (userID: string, notificationId: string | 'all', dataProviderId?: number) => void;
  notifications?: NotificationItem[];
  displayedNotifications?: NotificationItem[];
  isLoading?: boolean;
  hasUnreadNotifications?: boolean;
  userID?: string;
}

export const NotificationPopover = ({
  children,
  notifications = [],
  displayedNotifications,
  isLoading = false,
  handleNotificationClick,
  userID,
  hasUnreadNotifications,
}: NotificationPopoverProps) => {
  const [open, setOpen] = useState(false);

  // If displayedNotifications is not provided, show up to 10 (or all if less than 10)
  const finalDisplayedNotifications = useMemo(() => {
    if (displayedNotifications && displayedNotifications.length > 0) {
      return displayedNotifications;
    }
    return notifications.slice(0, Math.min(10, notifications.length));
  }, [displayedNotifications, notifications]);

  // Get total count of unread notifications (from all notifications, not just displayed)

  const handleItemClick = useCallback(
    (notificationId: string, dataProviderId?: number) => {
      if (!userID) return;
      handleNotificationClick(userID, notificationId, dataProviderId);
      setOpen(false);
    },
    [handleNotificationClick, userID]
  );

  const handleMarkAllAsRead = useCallback(() => {
    if (!userID) return;
    handleNotificationClick(userID, 'all');
    setOpen(false);
  }, [handleNotificationClick, userID]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      };
      const formattedDate = date.toLocaleDateString('en-GB', options);
      return formattedDate.replace(/\//g, '.');
    } catch {
      return dateString;
    }
  };

  const renderMessage = (type: string) => {
    if (type === 'harvest-completed') {
      return (
        <>
          <img src={success} alt="successHarvesting" />
          <span className="harvesting-type">
            {notificationText.notifications.messages.success}
          </span>
        </>
      )
    }
    if (type === 'harvest-failed') {
      return (
        <>
          <img src={failIcon} alt="faillHarvesting" />
          <span className="harvesting-type">
            {notificationText.notifications.messages.issue}
          </span>
        </>
      )
    }
    if (type === 'duplicates') {
      return notificationText.notifications.messages.duplicate;
    }
    return '';
  };

  const popoverContent = (
    <div className="notification-popover-content">
      {isLoading ? (
        <div className="notification-popover-loading">
          <Spin size="large" />
        </div>
      ) : !hasUnreadNotifications ? (
        <div className="no-notifications">
          <img src={arrows} alt="arrow" />
          <h5 className="no-notifications-title">
            {notificationText.notifications.noNotifications.title}
          </h5>
          <span className="no-notifications-text">
            {notificationText.notifications.noNotifications.description}
          </span>
          <Button
            type="default"
            className="no-notifications-action-button"
            onClick={() => setOpen(false)}
          >
            {notificationText.notifications.noNotifications.action.title}
          </Button>
        </div>
      ) : (
        <>
          {finalDisplayedNotifications.map((notification) => {
            // Show all notifications regardless of read status
            // isUnread is only used for visual indicator (red dot)
            const isUnread = !notification?.readStatus;
            return (
              <div
                key={notification.id}
                className="pop-up-item"
                onClick={() =>
                  handleItemClick(notification.id, notification.dataProviderId)
                }
                role="button"
                tabIndex={0}
                aria-label={`Notification ${notification.type}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleItemClick(notification.id, notification.dataProviderId);
                  }
                }}
              >
                <div className="pop-up-text">
                  <p className="pop-up-item-text">
                    {renderMessage(notification.type)}
                  </p>
                  <span className="created-date">
                    {formatDate(notification.createdDate)}
                  </span>
                </div>
                {isUnread ? (
                  <div className="status" />
                ) : (
                  <div className="placeholder" />
                )}
              </div>
            );
          })}
          {hasUnreadNotifications && (
            <div className="footer">
              <Button
                type="default"
                onClick={handleMarkAllAsRead}
                aria-label="Mark all notifications as read"
              >
                {notificationText.notifications.actions.read.name}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="notification-popover">
      <Popover
        content={popoverContent}
        trigger="click"
        placement="bottomRight"
        open={open}
        onOpenChange={setOpen}
        getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
      >
        {isValidElement(children)
          ? cloneElement(children, {
            ...(children.props as Record<string, unknown>),
          } as React.HTMLAttributes<HTMLElement>)
          : children}
      </Popover>
    </div>
  );
};

