import { CrFeatureLayout, CrPaper } from '@oacore/core-ui';
import fairTexts from '@features/Fair/texts/fair.json';
import { message } from 'antd';
import { useCallback, useState } from 'react';
import '../styles.css';

import { FairCertificationLoadingView } from '@features/Fair/components/FairCertificationLoadingView.tsx';
import { FairDocHeader } from '@features/Fair/components/FairDocHeader.tsx';
import { FairPrinciplesCollapse } from '@features/Fair/components/FairPrinciplesCollapse.tsx';
import { FairSubmissionProgress } from '@features/Fair/components/FairSubmissionProgress.tsx';
import {
  submitFairCertification,
  useFairCertification,
} from '@features/Fair/hooks/useFairCertification';
import type { FairCertificationApiResponse } from '@features/Fair/types/fairCertification.types';
import { useDataProviderStore } from '@/store/dataProviderStore';

export type ApprovedFairViewProps = {
  certificationQuestions?: FairCertificationApiResponse | null;
};

export const ApprovedFairView = ({ certificationQuestions }: ApprovedFairViewProps) => {
  const { selectedDataProvider } = useDataProviderStore();
  const dataProviderId = selectedDataProvider?.id;
  const { mutate, isLoading } = useFairCertification();
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

  if (isLoading) {
    return <FairCertificationLoadingView />;
  }

  return (
    <CrFeatureLayout>
      <CrPaper>
        <FairDocHeader certificationQuestions={certificationQuestions} />
        <FairPrinciplesCollapse
          certificationQuestions={certificationQuestions?.questions}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
        <FairSubmissionProgress />
      </CrPaper>
    </CrFeatureLayout>
  );
};
