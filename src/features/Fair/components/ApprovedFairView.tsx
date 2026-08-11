import { CrFeatureLayout, CrPaper } from '@oacore/core-ui';
import fairTexts from '@features/Fair/texts/fair.json';
import { message } from 'antd';
import axios from 'axios';
import { useCallback, useState } from 'react';
import '../styles.css';

import { FairCertificationLoadingView } from '@features/Fair/components/FairCertificationLoadingView.tsx';
import { FairCertificationErrorView } from '@features/Fair/components/FairCertificationErrorView.tsx';
import { FairDocHeader } from '@features/Fair/components/FairDocHeader.tsx';
import { FairPrinciplesCollapse } from '@features/Fair/components/FairPrinciplesCollapse.tsx';
import { FairSubmissionProgress } from '@features/Fair/components/FairSubmissionProgress.tsx';
import {
  submitFairCertification,
  useFairCertification,
} from '@features/Fair/hooks/useFairCertification';
import { useDataProviderStore } from '@/store/dataProviderStore';

export const ApprovedFairView = () => {
  const { selectedDataProvider } = useDataProviderStore();
  const dataProviderId = selectedDataProvider?.id;
  const { fairCertification, mutate, isLoading, error } = useFairCertification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitSuccessMessage, submitErrorMessage, submitApiErrorMessage } =
    fairTexts.principlesAccordion;

  const handleSubmit = useCallback(async () => {
    if (!dataProviderId) {
      return;
    }

    setIsSubmitting(true);

    try {
      await submitFairCertification(dataProviderId);
      await mutate();
      message.success(submitSuccessMessage);
    } catch (error) {
      const isMissingFieldsError =
        axios.isAxiosError(error) && error.response?.status === 400;

      message.error(isMissingFieldsError ? submitErrorMessage : submitApiErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    dataProviderId,
    mutate,
    submitApiErrorMessage,
    submitErrorMessage,
    submitSuccessMessage,
  ]);

  if (isLoading) {
    return <FairCertificationLoadingView />;
  }

  if (error && !fairCertification) {
    return <FairCertificationErrorView />;
  }

  return (
    <CrFeatureLayout>
      <CrPaper>
        <FairDocHeader certificationQuestions={fairCertification} />
        <FairPrinciplesCollapse
          certificationQuestions={fairCertification?.questions}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
        <FairSubmissionProgress />
      </CrPaper>
    </CrFeatureLayout>
  );
};
