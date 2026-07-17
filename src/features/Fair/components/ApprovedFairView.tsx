import { CrFeatureLayout, CrPaper } from '@oacore/core-ui';
import fairTexts from '@features/Fair/texts/fair.json';
import { message } from 'antd';
import { useCallback, useState } from 'react';
import '../styles.css';

import { FairDocHeader } from '@features/Fair/components/FairDocHeader.tsx';
import { FairPrinciplesCollapse } from '@features/Fair/components/FairPrinciplesCollapse.tsx';
import { FairSubmissionProgress } from '@features/Fair/components/FairSubmissionProgress.tsx';
import {
  submitFairCertification,
  useFairCertification,
} from '@features/Fair/hooks/useFairCertification';
import type { FairCertificationQuestion } from '@features/Fair/types/fairCertification.types';
import { useDataProviderStore } from '@/store/dataProviderStore';

export type ApprovedFairViewProps = {
  certificationQuestions?: FairCertificationQuestion[];
};

export const ApprovedFairView = ({ certificationQuestions }: ApprovedFairViewProps) => {
  const { selectedDataProvider } = useDataProviderStore();
  const dataProviderId = selectedDataProvider?.id;
  const { mutate } = useFairCertification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitSuccessMessage, submitErrorMessage } = fairTexts.principlesAccordion;

  const handleSubmit = useCallback(async () => {
    if (!dataProviderId) {
      return;
    }

    setIsSubmitting(true);

    try {
      await submitFairCertification(dataProviderId);
      await mutate();
      message.success(submitSuccessMessage);
    } catch {
      message.error(submitErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [dataProviderId, mutate, submitErrorMessage, submitSuccessMessage]);

  // const { selectedDataProvider, selectedSetSpec, statistics, doiStatistics } = useDataProviderStore();
  // const rorId = selectedDataProvider?.rorData?.rorId ?? null;
  // const { rioxx } = useRioxxStats(selectedDataProvider?.id);
  // const { usrnData } = useUsrnData(selectedDataProvider?.id);
  // const { irus } = useIrusStats(selectedDataProvider?.id);
  // const { stats: orcidStats } = useOrcidStats(selectedDataProvider?.id ?? 0);
  // const { data: dasData } = useDasData(selectedDataProvider?.id ?? 0);

  // useDataProviderStatistics(selectedDataProvider?.id ?? null, selectedSetSpec);
  // useDoiStatistics(selectedDataProvider?.id ?? null, selectedSetSpec);

  // const repositoryStatus: FairRepositoryStatusParams = {
  //   rioxx: rioxx ?? undefined,
  //   statistics: statistics ?? undefined,
  //   internalStatistics:
  //     statistics != null || doiStatistics != null
  //       ? {
  //         fullTextCount: statistics?.countFulltext,
  //         metadataCount: statistics?.countMetadata,
  //         doiCount: doiStatistics?.dataProviderDoiCount,
  //       }
  //       : undefined,
  //   usrn: usrnData ?? null,
  //   irus,
  //   rorId,
  //   orcidStats,
  //   dasData,
  // };

  return (
    <CrFeatureLayout>
      <CrPaper>
        <FairDocHeader />
        <FairPrinciplesCollapse
          certificationQuestions={certificationQuestions}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          // repositoryStatus={repositoryStatus}
        />
        <FairSubmissionProgress />
      </CrPaper>
    </CrFeatureLayout>
  );
};
