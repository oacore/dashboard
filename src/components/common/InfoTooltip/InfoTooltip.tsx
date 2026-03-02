import { Button, Tooltip } from 'antd';
import type { TooltipProps } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

type InfoTooltipProps = {
  title: TooltipProps['title'];
  ariaLabel?: string;
  iconStyle?: React.CSSProperties;
} & Omit<TooltipProps, 'title'>;

const DEFAULT_ICON_STYLE: React.CSSProperties = {
  fontSize: 20,
};

const InfoTooltip = ({
  title,
  ariaLabel,
  iconStyle,
  ...tooltipProps
}: InfoTooltipProps) => (
  <Tooltip title={title} {...tooltipProps}>
    <Button
      type="text"
      className="tooltip-button"
      aria-label={ariaLabel ?? (typeof title === 'string' ? title : undefined)}
      tabIndex={0}
    >
      <InfoCircleOutlined
        className="info-icon"
        style={{ ...DEFAULT_ICON_STYLE, ...iconStyle }}
      />
    </Button>
  </Tooltip>
);

export default InfoTooltip;
