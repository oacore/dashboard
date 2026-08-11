import type { FairCertificationQuestion } from '@features/Fair/types/fairCertification.types';

export const isFairOpenQuestion = (certificationQuestion?: FairCertificationQuestion): boolean =>
  certificationQuestion?.type === 'open';
