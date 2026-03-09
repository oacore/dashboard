import { CrMessage } from '@components/common/CrMessage/CrMessage.tsx';
import { WarningOutlined } from '@ant-design/icons';
import '../styles.css';
import { Markdown } from '@core/core-ui';
import { TextData } from '../texts';

export const NotEnoughDataMessage = () => (
  <CrMessage className="error-wrapper" variant="danger">
    <WarningOutlined className="warning-indicator" />
    {TextData.chart?.warning && <Markdown>{TextData.chart.warning}</Markdown>}
  </CrMessage>
);

export const NotEnoughDataBasedOnDates = () => (
  <CrMessage className="error-wrapper" variant="danger">
    There is not enough data available for this time period to generate a
    compliance view.
  </CrMessage>
);
