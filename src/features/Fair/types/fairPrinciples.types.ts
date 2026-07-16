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
  question: string;
  description?: string;
  recommendation?: string;
  openQuestion?: boolean;
  answerPlaceholder?: string;
  statusLabel?: string;
  statusNote?: string;
  metrics?: FairMetricLine[];
  /** Shown above `PercentBar` when counts are available (same role as USRN sub-items). */
  percentLabel?: string;
  /** Label for `countValue` (e.g. indexed metadata total). */
  counterLabel?: string;
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
