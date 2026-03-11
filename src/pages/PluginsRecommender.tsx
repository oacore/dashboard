import React from 'react';
import { useDocumentTitle } from '@hooks/useDocumentTitle';
import { CrFeatureLayout } from '@oacore/core-ui';
import { PluginDetailCard } from '@features/Plugins/components';

export const PluginsRecommenderPage: React.FC = () => {
  useDocumentTitle('CORE Recommender - Plugins');
  return (
    <CrFeatureLayout>
      <PluginDetailCard type="recommender" />
    </CrFeatureLayout>
  );
};
