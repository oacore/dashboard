import React from 'react';
import { useDocumentTitle } from '@hooks/useDocumentTitle';
import { CrFeatureLayout } from '@components/common/CrFeatureLayout';
import { PluginDetailCard } from '@features/Plugins/components';

export const PluginsDiscoveryPage: React.FC = () => {
  useDocumentTitle('CORE Discovery - Plugins');
  return (
    <CrFeatureLayout>
      <PluginDetailCard type="discovery" />
    </CrFeatureLayout>
  );
};
