import React from 'react';
import { Card } from 'antd';
import classNames from 'classnames';
import Markdown from '@components/common/Markdown/Markdown.tsx';
import { processTemplate } from '@utils/helpers.ts';
import { useDataProviderStore } from '@/store/dataProviderStore.ts';
import { texts } from '../texts';
import '../styles.css';

export type PluginType = 'discovery' | 'recommender';

interface PluginDetailCardProps extends React.HTMLAttributes<HTMLElement> {
  type: PluginType;
}

const getTemplateContext = (key: string | undefined): Record<string, string> =>
  typeof key === 'string' && key.length > 0 ? { key } : {};

export const PluginDetailCard: React.FC<PluginDetailCardProps> = ({
  type,
  className,
  ...restProps
}) => {
  const { plugins } = useDataProviderStore();
  const pluginKey = plugins[type]?.key;
  const textConfig = texts[type];
  const detailDescription = processTemplate(
    textConfig.detailDescription,
    getTemplateContext(pluginKey)
  );

  return (
    <Card
      className={classNames('plugins-detail-card', className)}
      aria-label={`${textConfig.title} plugin configuration`}
      {...restProps}
    >
      <h1 className="plugin-title">{textConfig.title}</h1>
      <Markdown>{detailDescription}</Markdown>
    </Card>
  );
};
