import { CrFeatureLayout, CrHeader, CrShowMore } from '@oacore/core-ui';

import { useDataProviderStore } from '@/store/dataProviderStore';

import { FreshFindsTable } from './components/FreshFindsTable.tsx';
import { useFreshFindsData } from './hooks/useFreshFindsData';
import { useFreshFindsStore } from './store/freshFindsStore';
import { articleTemplateData } from './texts';

import './FreshFindsFeature.css';

export const FreshFindsFeature = () => {
    const { selectedDataProvider } = useDataProviderStore();
    const { error, isLoading } = useFreshFindsData(selectedDataProvider?.id ?? null);
    const { freshFindsData } = useFreshFindsStore();

    console.log(freshFindsData, "freshFindsData");

    return (
        <CrFeatureLayout>
            <CrHeader
                title={articleTemplateData.title}
                showMore={
                    <CrShowMore
                        text={articleTemplateData.description}
                        maxLetters={320}
                    />
                }
            />
            <main className="page fresh-finds-page">
                <FreshFindsTable
                    records={freshFindsData}
                    isLoading={isLoading}
                    error={error}
                    dataProviderName={selectedDataProvider?.name ?? 'your institution'}
                    institutionLabel={
                        selectedDataProvider?.institution ??
                        selectedDataProvider?.name ??
                        ''
                    }
                />
            </main>
        </CrFeatureLayout>
    );
};
