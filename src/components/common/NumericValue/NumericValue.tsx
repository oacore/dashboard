import classNames from 'classnames';
import { formatNumber } from '@/utils/helpers';
import './styles.css';

interface NumericValueProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  value: number | string | React.ReactNode;
  append?: string | React.ReactNode;
  caption?: string | React.ReactNode;
  diff?: string | React.ReactNode;
  title?: string | React.ReactNode;
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
  compactDisplay?: 'short' | 'long';
  maximumFractionDigits?: number;
  bold?: boolean;
  size?: 'small' | 'medium' | 'large';
  tooltip?: string | React.ReactNode;
}

const NumericValue = ({
  value,
  append,
  caption,
  diff,
  title,
  notation = 'compact',
  compactDisplay,
  maximumFractionDigits = 2,
  bold,
  size,
  className,
  ...htmlProps
}: NumericValueProps) => (
  <div
    className={classNames('numeric-value-container', {
      [`numeric-value-${size}`]: size,
    }, className)}
    {...htmlProps}
  >
    <div className="numeric-value-tooltip-wrapper">
      {title && <span className="numeric-value-title">{title}</span>}
    </div>
    <span
      className={classNames('numeric-value-value', {
        'numeric-value-bold': bold,
      })}
    >
      {typeof value === 'number'
        ? formatNumber(value, {
          notation,
          compactDisplay,
          maximumFractionDigits,
        })
        : value}
    </span>
    {append && (
      <span
        className={classNames('numeric-value-append', {
          'numeric-value-bold': bold,
        })}
      >
        {append}
      </span>
    )}
    {diff && <span className="numeric-value-diff">{diff}</span>}
    {caption && <span className="numeric-value-caption">{caption}</span>}
  </div>
);

export default NumericValue;

