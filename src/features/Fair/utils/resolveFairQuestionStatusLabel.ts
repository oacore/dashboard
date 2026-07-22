import type { FairCertificationQuestion } from '@features/Fair/types/fairCertification.types';

export const resolveFairQuestionStatusLabel = (
  certificationQuestion?: FairCertificationQuestion,
): string => {
  if (!certificationQuestion?.result) {
    return '_';
  }

  const status = certificationQuestion.result.status?.toLowerCase();

  if (status === 'pass') {
    return 'YES';
  }

  if (status === 'fail') {
    return 'No';
  }

  return '_';
};
