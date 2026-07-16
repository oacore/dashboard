import type { FairCertificationQuestion } from '@features/Fair/types/fairCertification.types';

export const resolveFairQuestionStatusLabel = (
  certificationQuestion?: FairCertificationQuestion,
  openQuestionLabel = 'Open question',
): string => {
  if (!certificationQuestion || !('result' in certificationQuestion)) {
    return openQuestionLabel;
  }

  const status = certificationQuestion.result?.status?.toLowerCase();

  if (status === 'pass') {
    return 'YES';
  }

  if (status === 'fail') {
    return 'No';
  }

  if (status === 'unknown') {
    return '_';
  }

  return openQuestionLabel;
};
