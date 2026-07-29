import type { FairQuestionStatusKey } from '@features/Fair/utils/resolveFairQuestionStatus';

export const getFairQuestionStatusClassName = (statusKey: FairQuestionStatusKey): string => {
  if (statusKey === 'pass') {
    return 'support-status__status--yes';
  }

  if (statusKey === 'fail') {
    return 'support-status__status--no';
  }

  if (statusKey === 'error') {
    return 'support-status__status--error';
  }

  return 'support-status__status--neutral';
};
