import {DownOutlined} from '@ant-design/icons';
import {Collapse} from 'antd';
import type {CollapseProps} from 'antd';
import type {ReactNode} from 'react';
import {useCallback} from 'react';

import '../styles.css';

export type FairPrinciplesCollapsibleVariant = 'default' | 'compact';

export type FairPrinciplesCollapsibleSection = {
  key: string;
  /** Panel header (e.g. title + summary). */
  label: ReactNode;
  /** Expanded panel body — any view: questions list, placeholder, or custom markup. */
  children: ReactNode;
};

export type FairPrinciplesCollapsibleProps = {
  /** Visual density: `default` matches the FAIR certification design; `compact` uses tighter spacing. */
  variant?: FairPrinciplesCollapsibleVariant;
  /** Accessible name for the accordion region. */
  ariaLabel?: string;
  /** One entry per collapsible panel. */
  sections: FairPrinciplesCollapsibleSection[];
  /** Initially expanded panel key(s). */
  defaultActiveKey?: string | string[];
  /** Controlled active keys (optional; when set, use with `onChange`). */
  activeKey?: string | string[];
  onChange?: (key: string | string[]) => void;
  /** Extra class on the outer `<section>` wrapper. */
  className?: string;
  /** Extra class on the Ant Design `Collapse` root. */
  collapseClassName?: string;
  expandIconPlacement?: CollapseProps['expandIconPlacement'];
  bordered?: boolean;
  ghost?: boolean;
};

const variantClassName: Record<FairPrinciplesCollapsibleVariant, string> = {
  default: 'fair-principles-collapse--variant-default',
  compact: 'fair-principles-collapse--variant-compact',
};

export const FairPrinciplesCollapsible = ({
  variant = 'default',
  ariaLabel,
  sections,
  defaultActiveKey,
  activeKey,
  onChange,
  className = '',
  collapseClassName = '',
  expandIconPlacement = 'end',
  bordered = false,
  ghost = true,
}: FairPrinciplesCollapsibleProps) => {
  const renderExpandIcon: NonNullable<CollapseProps['expandIcon']> = useCallback((panelProps) => {
    const isActive = Boolean(panelProps.isActive);
    return (
      <span aria-hidden className="fair-principles-collapse-expand-icon">
        <DownOutlined className="fair-principles-collapse-chevron" rotate={isActive ? 180 : 0} />
      </span>
    );
  }, []);

  const items: CollapseProps['items'] = sections.map(({key, label, children}) => ({
    key,
    label,
    children,
  }));

  const collapseClassNames = [
    'fair-principles-collapse',
    variantClassName[variant],
    collapseClassName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      aria-label={ariaLabel}
      className={`fair-principles-collapsible-root ${className}`.trim()}
      role={ariaLabel ? 'region' : undefined}
    >
      <Collapse
        activeKey={activeKey}
        bordered={bordered}
        className={collapseClassNames}
        defaultActiveKey={defaultActiveKey}
        expandIcon={renderExpandIcon}
        expandIconPlacement={expandIconPlacement}
        ghost={ghost}
        items={items}
        onChange={onChange}
      />
    </div>
  );
};
