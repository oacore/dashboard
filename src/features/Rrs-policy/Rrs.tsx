import { CrHeader, CrFeatureLayout, CrCardsWrapper, CrShowMore } from '@oacore/core-ui';
import { TextData } from '@features/Rrs-policy/texts';
import { CrStatsCard } from '@components/common/CrStatsCard/CrStatsCard.tsx';
import { useRrsData } from '@features/Rrs-policy/hooks/useRrsData.ts';
import { useDataProviderStore } from '@/store/dataProviderStore.ts';
import { RrsTable } from '@features/Rrs-policy/components/RrsTable.tsx';
import { CrPdfUpload } from '@components/common/CrPdfUpload/CrPdfUpload.tsx';
import { usePdfUpload } from '@/hooks/usePdfUpload';
import "./styles.css"
import { useDownloadRrsCsv } from '@features/Rrs-policy/hooks/useDownloadRrsCsv';
import {useBillingPlanData} from '@features/Orcid/hooks/useBillingPlanData.ts';
import {useOrganisation} from '@features/Settings/OrganisationalSettings/hooks/useOrganisation.ts';

export const RrsFeature = () => {
  const { selectedDataProvider } = useDataProviderStore();
  const { organisation } = useOrganisation();
  const { downloadCsv, isLoading: isDownloadingCsv } = useDownloadRrsCsv();

  const {
    data,
    error,
    isLoading,
  } = useRrsData(selectedDataProvider?.id || 0);

  // PDF Upload hook
  const {
    handlePdfUpload,
    uploadResults,
    isLoading: pdfLoading,
    error: uploadError,
    resetResults
  } = usePdfUpload('/internal/data-providers/rights-retention-upload-file');

  const { isStartingPlan } = useBillingPlanData(data, organisation);

  const rrsToReviewList = data.filter(
    (item) => Number(item.validationStatusRRS) !== 1 && Number(item.validationStatusRRS) !== 2
  )

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
          actionLoading={isDownloadingCsv}
          isStartingPlan={isStartingPlan}
        />
        <CrStatsCard
          countClassName="count-red"
          title={TextData.reviewCard.title}
          description={TextData.reviewCard.description}
          count={rrsToReviewList.length}
          loading={isLoading}
          error={error}
          actionText={TextData.reviewCard.action}
          infoText={TextData.reviewCard.info}
          actionHref="#rrsTable"
          showInfo
        />
        <CrPdfUpload
          title="RRS Demo Checker"
          onUpload={handlePdfUpload}
          uploadResults={uploadResults}
          loading={pdfLoading}
          foundSentence={uploadResults.rightsRetentionSentence}
          licenseType={uploadResults.licenceRecognised}
          showInfo
          infoText={TextData.checkCard.info}
          error={uploadError}
          onResetResults={resetResults}
          texts={TextData.upload}
        />
      </CrCardsWrapper>
      <RrsTable
        downloadCsv={downloadCsv}
        downloadCsvLoading={isDownloadingCsv}
      />
    </CrFeatureLayout>
  );
};
