import { Card } from 'antd';
import NumericValue from '@/components/common/NumericValue/NumericValue';
import '../styles.css';

interface BaseHarvestingCardProps {
  value: number | string | React.ReactNode;
  title: string | React.ReactNode;
  tooltip?: string | React.ReactNode;
  bold?: boolean;
  className?: string;
  wrapperClassName?: string;
  children?: React.ReactNode;
}

const BaseHarvestingCard = ({
  value,
  title,
  bold = true,
  className,
  wrapperClassName,
  children,
}: BaseHarvestingCardProps) => {
  return (
    <Card className={`harvesting-card-wrapper ${wrapperClassName || ''}`.trim()}>
      <NumericValue
        value={value}
        title={title}
        bold={bold}
        className={className || 'harvesting-metadata-item'}
      />
      {children}
    </Card>
  );
};

export default BaseHarvestingCard;

