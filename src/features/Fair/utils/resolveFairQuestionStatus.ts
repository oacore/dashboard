import type { FairCertificationQuestion } from '@features/Fair/types/fairCertification.types';

export type FairQuestionStatusKey = 'pass' | 'fail' | 'na' | 'error' | 'unknown' | 'none';

export type FairQuestionStatusDisplay = {
  key: FairQuestionStatusKey;
  label: string;
};

export const resolveFairQuestionStatus = (
  certificationQuestion?: FairCertificationQuestion,
): FairQuestionStatusDisplay => {
  if (!certificationQuestion?.result) {
    return { key: 'none', label: '' };
  }

  const status = certificationQuestion.result.status?.toLowerCase();

  if (!status) {
    return { key: 'none', label: '' };
  }

  if (status === 'pass') {
    return { key: 'pass', label: 'Yes' };
  }

  if (status === 'fail') {
    return { key: 'fail', label: 'No' };
  }

  if (status === 'n/a') {
    return { key: 'na', label: 'n/a' };
  }

  if (status === 'error') {
    return { key: 'error', label: '' };
  }

  if (status === 'unknown') {
    return { key: 'unknown', label: 'n/a' };
  }

  return { key: 'unknown', label: 'n/a' };
};
