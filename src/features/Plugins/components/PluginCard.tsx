import React from 'react';
import { Card, Button } from 'antd';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { useDashboardRoute } from '@hooks/useDashboardRoute';
import type { ComponentPropsWithoutRef, ElementType } from 'react';
import '../styles.css';

export interface PluginCardProps extends Omit<ComponentPropsWithoutRef<typeof Card>, 'title'> {
  title: string;
  description?: string;
  actionCaption: string;
  href: string;
  tag?: ElementType;
}

const PluginCard: React.FC<PluginCardProps> = ({
  title,
  description,
  actionCaption,
  href,
  tag: WrapperTag = 'div',
  className,
  ...restProps
}) => {
  const { selectedDataProvider } = useDataProviderStore();
  const { buildPath } = useDashboardRoute();

  const pathSegment = href.replace(/^plugins\//, '');
  const to = selectedDataProvider?.id ? buildPath(`plugins/${pathSegment}`) : '#';
  const isDisabled = !selectedDataProvider?.id;
  const ariaLabel = isDisabled
    ? `${actionCaption} - ${title} (repository selection required)`
    : `${actionCaption} - ${title}`;

  const actionButton = isDisabled ? (
    <Button type="primary" disabled className="plugin-card__button" aria-label={ariaLabel}>
      {actionCaption}
    </Button>
  ) : (
    <Link to={to} aria-label={ariaLabel}>
      <Button type="primary" className="plugin-card__button">
        {actionCaption}
      </Button>
    </Link>
  );

  return (
    <WrapperTag>
      <Card
        className={classNames('plugin-card', className)}
        {...restProps}
      >
        <h2 className="plugin-title">{title}</h2>
        {description && <p className="plugin-description">{description}</p>}
        {actionButton}
      </Card>
    </WrapperTag>
  );
};

export default PluginCard;
