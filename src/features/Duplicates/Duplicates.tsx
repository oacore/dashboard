import { CrHeader } from '@components/common/CrHeader/CrHeader.tsx';
import { CrShowMore } from '@components/common/CrShowMore/CrShowMore.tsx';
import { CrCardsWrapper, CrFeatureLayout } from '@components/common/CrFeatureLayout';
import { TextData } from '@features/Duplicates/texts';
import { useDuplicatesData } from '@features/Duplicates/hooks/useDuplicatesData';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { CrStatsCard } from '@components/common/CrStatsCard/CrStatsCard.tsx';
import { useDuplicatesStore } from '@features/Duplicates/store/duplicatesStore.ts';
import { useState } from 'react';
import type { DuplicateData } from '@features/Duplicates/types/data.types.ts';
import "./styles.css"
import { DeduplicationTable } from '@features/Duplicates/components/DuplicatesTable.tsx';
import { ComparisonView } from '@features/Duplicates/components/ComparisonView.tsx';
import { useBillingPlanData } from '@features/Orcid/hooks/useBillingPlanData.ts';
import { useOrganisation } from '@features/Settings/OrganisationalSettings/hooks/useOrganisation.ts';
import BaseHarvestingCard from '@features/indexing/components/BaseHarvestingCard.tsx';
import infoIcon from '@/assets/icons/info.svg';
import { formatDate } from '@utils/helpers.ts';
import { useHarvestingStatus } from '@features/indexing/hooks/useHarvestingStatus.ts';


export const DeduplicationFeature = () => {
  const { selectedDataProvider } = useDataProviderStore();
  const { harvestingStatus, harvestingError } = useHarvestingStatus(false);
  const { organisation } = useOrganisation();
  const [selectedRow, setSelectedRow] = useState<DuplicateData | null>(null);

  const {
    data,
    count,
    error,
    isLoading,
  } = useDuplicatesData(
    selectedDataProvider?.id || null,
    false
  );

  const { isStartingPlan } = useBillingPlanData(data, organisation);

  const { downloadCsv } = useDuplicatesStore();

  const handleRowClick = (record: DuplicateData) => {
    setSelectedRow(record);
  };

  const handleBackToTable = () => {
    setSelectedRow(null);
  };

  return (
    <CrFeatureLayout>
      <CrHeader
        title={TextData.title}
        identifier="BETA"
        showMore={
          <CrShowMore
            text={TextData.description}
            maxLetters={320}
          />
        }
      />
      <CrCardsWrapper className="duplicates-cards-wrapper">
        <BaseHarvestingCard
          className="duplicates-card"
          value={
            harvestingError ? (
              <div className="harvesting-errors-wrapper">
                <img className="harvesting-info-icon" src={infoIcon} alt="info" />
                <p className="harvesting-error-text">
                  Failed to load last update data. Please try again later.
                </p>
              </div>
            ) : (
              formatDate(harvestingStatus?.lastHarvestingDate || 0)
            )
          }
          title="Last successful updating"
        >
          {!harvestingError && (
            <div className="error-wrapper">
              <p className="errors-info">
                Detection of versions and near-duplicates runs automatically every time after your repository is harvested.
              </p>
            </div>
          )}
        </BaseHarvestingCard>
        <CrStatsCard
          countClassName="count-dark"
          title={TextData.info.title}
          description={TextData.info.description}
          count={count}
          loading={isLoading}
          error={error}
          actionText={TextData.info.action}
          infoText={TextData.info.info}
          onActionClick={downloadCsv}
          showInfo
          isStartingPlan={isStartingPlan}
        />
      </CrCardsWrapper>
      {selectedRow ? (
        <ComparisonView
          duplicateData={selectedRow}
          onBack={handleBackToTable}
        />
      ) : (
        <DeduplicationTable
          count={count}
          duplicatesData={data}
          isLoading={isLoading}
          error={error}
          downloadCsv={downloadCsv}
          onRowClick={handleRowClick}
        />
      )}
    </CrFeatureLayout>
  )
}
