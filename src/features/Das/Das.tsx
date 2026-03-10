import { CrHeader, CrFeatureLayout, CrCardsWrapper } from '@core/core-ui';
import { CrShowMore } from '@components/common/CrShowMore/CrShowMore.tsx';
import { TextData } from '@features/Das/texts';
import { CrStatsCard } from '@components/common/CrStatsCard/CrStatsCard.tsx';
import { useDataProviderStore } from '@/store/dataProviderStore.ts';
import { CrPdfUpload } from '@components/common/CrPdfUpload/CrPdfUpload.tsx';
import { usePdfUpload } from '@/hooks/usePdfUpload';
import "./styles.css"
import { DasTable } from '@features/Das/components/DasTable.tsx';
import { useDasStore } from '@features/Das/store/dasStore.ts';
import { useDasData } from '@features/Das/hooks/useDasData.ts';
import { useBillingPlanData } from '@features/Orcid/hooks/useBillingPlanData.ts';
import { useOrganisation } from '@features/Settings/OrganisationalSettings/hooks/useOrganisation.ts';

export const DasFeature = () => {
  const { selectedDataProvider } = useDataProviderStore();
  const {
    downloadCsv,
  } = useDasStore();
  const { organisation } = useOrganisation();

  const {
    data,
    error,
    isLoading,
  } = useDasData(selectedDataProvider?.id || 0);

  // PDF Upload hook
  const {
    handlePdfUpload,
    uploadResults,
    isLoading: pdfLoading,
    error: uploadError,
    resetResults
  } = usePdfUpload('/internal/data-providers/data-access-upload-file');

  const dasToReviewList = data.filter(
    (item) => Number(item.validationStatusDataAccess) !== 1 && Number(item.validationStatusDataAccess) !== 2
  )

  const { isStartingPlan } = useBillingPlanData(data, organisation);

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
      <CrCardsWrapper>
        <CrStatsCard
          title={TextData.statsCard.title}
          description={TextData.statsCard.description}
          count={data.length}
          loading={isLoading}
          error={error}
          actionText={TextData.statsCard.action}
          onActionClick={downloadCsv}
          isStartingPlan={isStartingPlan}
        />
        <CrStatsCard
          countClassName="count-red"
          title={TextData.reviewCard.title}
          description={TextData.reviewCard.description}
          count={dasToReviewList.length}
          loading={isLoading}
          error={error}
          actionText={TextData.reviewCard.action}
          infoText={TextData.reviewCard.info}
          actionHref="#dasTable"
          showInfo
        />
        <CrPdfUpload
          title="Data Availability Statement demo checker"
          onUpload={handlePdfUpload}
          uploadResults={uploadResults}
          loading={pdfLoading}
          foundSentence={uploadResults.dataAccessSentence}
          licenseType={uploadResults.dataAccessUrl}
          showInfo={true}
          infoText={TextData.checkCard.info}
          error={uploadError}
          onResetResults={resetResults}
          texts={TextData.upload}
        />
      </CrCardsWrapper>
      <DasTable />
    </CrFeatureLayout>
  );
};
