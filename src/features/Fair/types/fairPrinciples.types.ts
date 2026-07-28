import type { FairCertificationQuestion } from '@features/Fair/types/fairCertification.types';

export type FairMetricLine = {
  label: string;
  value: string;
};

export type FairQuestionItem = {
  id: string;
  code: string;
  /** Matches API question `number` (e.g. "1.1", "2.4"). */
  number?: string;
  /** Links a display-only sub-row to an open question's API result (e.g. "1.3", "2.1"). */
  linkedQuestionNumber?: string;
  question: string;
  description?: string;
  recommendation?: string;
  answerPlaceholder?: string;
  statusLabel?: string;
  metrics?: FairMetricLine[];
  /** Labels for API count rows, mapped by index (same order as `result.counts`). */
  counterLabels?: string[];
  /** Labels for API metric rows, mapped by index (same order as `result.metrics`). */
  percentLabels?: string[];
  certificationQuestion?: FairCertificationQuestion;
};

export type FairPrincipleSection = {
  title: string;
  description: string;
  items: FairQuestionItem[];
};

export const FAIR_PRINCIPLE_SECTION_KEYS = [
  'findable',
  'accessible',
  'interoperable',
  'reusable',
  'fitForFunders',
  'fitForFuture',
  'operational',
] as const;

export type FairPrincipleSectionKey = (typeof FAIR_PRINCIPLE_SECTION_KEYS)[number];
