import { CrFeatureLayout, CrHeader, CrShowMore } from '@oacore/core-ui';

import { useDataProviderStore } from '@/store/dataProviderStore';

import { FreshFindsTable } from './components/FreshFindsTable.tsx';
import { articleTemplateData } from './texts';

import './FreshFindsFeature.css';

export const FreshFindsFeature = () => {
  const { selectedDataProvider } = useDataProviderStore();

  return (
    <CrFeatureLayout>
      <CrHeader
        identifier="Demo"
        title={articleTemplateData.title}
        showMore={
          <CrShowMore text={articleTemplateData.description} maxLetters={320} />
        }
      />
      <main className="page fresh-finds-page">
        <FreshFindsTable
          dataProviderName={selectedDataProvider?.name ?? 'your institution'}
        />
      </main>
    </CrFeatureLayout>
  );
};
