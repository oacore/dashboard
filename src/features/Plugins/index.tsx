import React from 'react';
import { CrFeatureLayout } from '@core/core-ui';
import { PluginCard } from './components';
import type { PluginType } from './components';
import { texts } from './texts';
import './styles.css';

const PLUGIN_TYPES: PluginType[] = ['discovery', 'recommender'];

export const PluginsFeature: React.FC<React.HTMLAttributes<HTMLElement>> = () => (
  <CrFeatureLayout>
    <h3 className="plugin-main-title">{texts.title}</h3>
    {PLUGIN_TYPES.map((type) => (
      <PluginCard
        key={type}
        tag="section"
        title={texts[type].title}
        description={texts[type].description}
        actionCaption={texts[type].action}
        href={type}
      />
    ))}
  </CrFeatureLayout>
);
