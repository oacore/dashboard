import { CrFeatureLayout, CrPaper } from '@oacore/core-ui';
import fairTexts from '@features/Fair/texts/fair.json';
import { message, notification } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import '../styles.css';

import { FairCertificationLoadingView } from '@features/Fair/components/FairCertificationLoadingView.tsx';
import { FairCertificationErrorView } from '@features/Fair/components/FairCertificationErrorView.tsx';
import { FairDocHeader } from '@features/Fair/components/FairDocHeader.tsx';
import { FairPrinciplesCollapse } from '@features/Fair/components/FairPrinciplesCollapse.tsx';
import { FairSubmissionProgress } from '@features/Fair/components/FairSubmissionProgress.tsx';
import {
  submitFairCertification,
  useFairCertification,
  useFairCertificationSubmissions,
} from '@features/Fair/hooks/useFairCertification';
import type { FairCertificationQuestion } from '@features/Fair/types/fairCertification.types';
import { useDataProviderStore } from '@/store/dataProviderStore';

const MISSING_FIELDS_NOTIFICATION_KEY = 'fair-submit-missing-fields';

const getMissingQuestionNumbers = (error: unknown): string[] => {
  if (!axios.isAxiosError(error)) {
    return [];
  }

  const apiMessage = error.response?.data?.message;
  if (typeof apiMessage !== 'string') {
    return [];
  }

  const missingPart = apiMessage.split(/missing:/i)[1] ?? apiMessage;
  return [...new Set(missingPart.match(/\d+\.\d+/g) ?? [])];
};

const scrollToQuestion = (questionNumber: string) => {
  document.getElementById(`fair-question-${questionNumber}`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });
};

const showMissingFieldsNotification = (
  missingNumbers: string[],
  questions: FairCertificationQuestion[] | undefined,
  title: string,
) => {
  notification.error({
    key: MISSING_FIELDS_NOTIFICATION_KEY,
    title,
    duration: false,
    placement: 'bottomRight',
    description: (
      <ul className="fair-submit-missing-fields">
        {missingNumbers.map((questionNumber) => {
          const question = questions?.find((item) => item.number === questionNumber);

          return (
            <li key={questionNumber}>
              <button
                aria-label={`Go to required question ${questionNumber}`}
                className="fair-submit-missing-fields__link"
                onClick={() => scrollToQuestion(questionNumber)}
                type="button"
              >
                {question ? `${questionNumber}: ${question.question}` : questionNumber}
              </button>
            </li>
          );
        })}
      </ul>
    ),
  });
};

export const ApprovedFairView = () => {
  const { selectedDataProvider } = useDataProviderStore();
  const dataProviderId = selectedDataProvider?.id;
  const { fairCertification, mutate, isLoading, error } = useFairCertification();
  const { mutate: mutateSubmissions } = useFairCertificationSubmissions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [missingQuestionNumbers, setMissingQuestionNumbers] = useState<string[]>([]);
  const { submitSuccessMessage, submitErrorMessage, submitApiErrorMessage } =
    fairTexts.principlesAccordion;

  const handleSubmit = async () => {
    if (!dataProviderId) {
      return;
    }

    setIsSubmitting(true);
    setMissingQuestionNumbers([]);
    notification.destroy(MISSING_FIELDS_NOTIFICATION_KEY);

    try {
      await submitFairCertification(dataProviderId);
      await Promise.all([mutate(), mutateSubmissions()]);
      message.success(submitSuccessMessage);
    } catch (submitError) {
      const isValidationError =
        axios.isAxiosError(submitError) && submitError.response?.status === 400;

      if (!isValidationError) {
        message.error(submitApiErrorMessage);
        return;
      }

      const missingNumbers = getMissingQuestionNumbers(submitError);
      setMissingQuestionNumbers(missingNumbers);

      if (!missingNumbers.length) {
        message.error(submitErrorMessage);
        return;
      }

      showMissingFieldsNotification(
        missingNumbers,
        fairCertification?.questions,
        submitErrorMessage,
      );
      window.setTimeout(() => scrollToQuestion(missingNumbers[0]), 350);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          missingQuestionNumbers={missingQuestionNumbers}
          onSubmit={handleSubmit}
        />
        <FairSubmissionProgress />
      </CrPaper>
    </CrFeatureLayout>
  );
};
