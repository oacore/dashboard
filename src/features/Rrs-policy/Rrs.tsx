import { CrHeader } from '@core/core-ui';
import { CrShowMore } from '@components/common/CrShowMore/CrShowMore.tsx';
import { CrFeatureLayout, CrCardsWrapper } from '@components/common/CrFeatureLayout';
import { TextData } from '@features/Rrs-policy/texts';
import { CrStatsCard } from '@components/common/CrStatsCard/CrStatsCard.tsx';
import { useRrsData } from '@features/Rrs-policy/hooks/useRrsData.ts';
import { useDataProviderStore } from '@/store/dataProviderStore.ts';
import { RrsTable } from '@features/Rrs-policy/components/RrsTable.tsx';
import { CrPdfUpload } from '@components/common/CrPdfUpload/CrPdfUpload.tsx';
import { usePdfUpload } from '@/hooks/usePdfUpload';
import "./styles.css"
import { useRrsStore } from '@features/Rrs-policy/store/rrsStore.ts';
import {useBillingPlanData} from '@features/Orcid/hooks/useBillingPlanData.ts';
import {useOrganisation} from '@features/Settings/OrganisationalSettings/hooks/useOrganisation.ts';

export const RrsFeature = () => {
  const { selectedDataProvider } = useDataProviderStore();
  const { organisation } = useOrganisation();
  const {
    downloadCsv,
  } = useRrsStore();

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
      <RrsTable />
    </CrFeatureLayout>
  );
};
