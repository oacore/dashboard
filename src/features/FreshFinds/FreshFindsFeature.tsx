import { useState } from 'react';
import { CrFeatureLayout } from '@oacore/core-ui';

import { useDataProviderStore } from '@/store/dataProviderStore';

import { FreshFindsHeaderArea } from './components/FreshFindsHeaderArea.tsx';
import { FreshFindsTable } from './components/FreshFindsTable.tsx';

import './FreshFindsFeature.css';

export const FreshFindsFeature = () => {
  const { selectedDataProvider } = useDataProviderStore();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <CrFeatureLayout>
      <FreshFindsHeaderArea showSettings={showSettings} setShowSettings={setShowSettings} />
      <main className="page fresh-finds-page">
        <FreshFindsTable
          dataProviderName={selectedDataProvider?.name ?? 'your institution'}
        />
      </main>
    </CrFeatureLayout>
  );
};
