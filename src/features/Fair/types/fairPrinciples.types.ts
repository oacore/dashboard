export type FairMetricLine = {
  label: string;
  value: string;
};

export type FairQuestionItem = {
  id: string;
  code: string;
  question: string;
  description: string;
  recommendation?: string;
  openQuestion?: boolean;
  answerPlaceholder?: string;
  statusLabel?: string;
  statusNote?: string;
  metrics?: FairMetricLine[];
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
