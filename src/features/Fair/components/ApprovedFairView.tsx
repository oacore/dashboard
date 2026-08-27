import { CrFeatureLayout, CrPaper } from '@oacore/core-ui';
import fairTexts from '@features/Fair/texts/fair.json';
import { message, notification } from 'antd';
import { useState } from 'react';
import '../styles.css';

import { FairCertificationLoadingView } from '@features/Fair/components/FairCertificationLoadingView.tsx';
import { FairCertificationErrorView } from '@features/Fair/components/FairCertificationErrorView.tsx';
import { FairDocHeader } from '@features/Fair/components/FairDocHeader.tsx';
import { FairPrinciplesCollapse } from '@features/Fair/components/FairPrinciplesCollapse.tsx';
import { FairSubmissionProgress } from '@features/Fair/components/FairSubmissionProgress.tsx';
import { FairSubmitConfirmationModal } from '@features/Fair/components/FairSubmitConfirmationModal.tsx';
import {
  submitFairCertification,
  useFairCertification,
  useFairCertificationSubmissions,
  waitForPendingFairAnswerSaves,
} from '@features/Fair/hooks/useFairCertification';
import type { FairCertificationQuestion } from '@features/Fair/types/fairCertification.types';
import { getMissingFairQuestionNumbers } from '@features/Fair/utils/getMissingFairQuestionNumbers';
import { useDataProviderStore } from '@/store/dataProviderStore';

const MISSING_FIELDS_NOTIFICATION_KEY = 'fair-submit-missing-fields';

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
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [missingQuestionNumbers, setMissingQuestionNumbers] = useState<string[]>([]);
  const { submitErrorMessage, submitApiErrorMessage } = fairTexts.principlesAccordion;

  const handleOpenSubmitModal = async () => {
    if (!dataProviderId) {
      return;
    }

    notification.destroy(MISSING_FIELDS_NOTIFICATION_KEY);
    setIsValidating(true);

    try {
      await waitForPendingFairAnswerSaves();
      const latestCertification = (await mutate()) ?? fairCertification;
      const questions = latestCertification?.questions;
      const missingNumbers = getMissingFairQuestionNumbers(questions);
      setMissingQuestionNumbers(missingNumbers);

      if (missingNumbers.length) {
        showMissingFieldsNotification(missingNumbers, questions, submitErrorMessage);
        window.setTimeout(() => scrollToQuestion(missingNumbers[0]), 350);
        return;
      }

      setIsSubmitted(false);
      setIsSubmitModalOpen(true);
    } finally {
      setIsValidating(false);
    }
  };

  const handleConfirmSubmit = async () => {
    if (!dataProviderId) {
      return;
    }

    setIsSubmitting(true);

    try {
      await submitFairCertification(dataProviderId);
      await Promise.all([mutate(), mutateSubmissions()]);
      setIsSubmitted(true);
    } catch {
      message.error(submitApiErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSubmitModal = () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitModalOpen(false);
    setIsSubmitted(false);
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
          isSubmitting={isValidating || isSubmitModalOpen}
          missingQuestionNumbers={missingQuestionNumbers}
          onSubmit={handleOpenSubmitModal}
        />
        <FairSubmissionProgress />
        <FairSubmitConfirmationModal
          isSubmitted={isSubmitted}
          isSubmitting={isSubmitting}
          onClose={handleCloseSubmitModal}
          onConfirm={handleConfirmSubmit}
          open={isSubmitModalOpen}
        />
      </CrPaper>
    </CrFeatureLayout>
  );
};
