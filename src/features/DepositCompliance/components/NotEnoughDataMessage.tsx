import { WarningOutlined } from '@ant-design/icons';
import '../styles.css';
import { Markdown, CrMessage } from '@core/core-ui';
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
