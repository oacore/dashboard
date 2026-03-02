import '../styles.css';
import {WarningOutlined} from '@ant-design/icons';
import {CrMessage} from '@components/common/CrMessage/CrMessage.tsx';

interface RegionAlertProps {
  className?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

export const RegionAlert = ({
  children: message,
}: RegionAlertProps) => (
  <CrMessage className="error-wrapper" variant="danger">
    <WarningOutlined className="warning-indicator" />
    <p className="warning-message">{message}</p>
  </CrMessage>
);
