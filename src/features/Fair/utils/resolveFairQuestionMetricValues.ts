import type {FairCertificationQuestionMetrics} from '@features/Fair/types/fairCertification.types';

import type {FairQuestionResultNamedValue} from '@features/Fair/utils/resolveFairQuestionCountValues';

const hasMetricValue = (value: number | null | undefined): value is number =>
  value != null && value !== 0;

export const resolveFairQuestionMetricValues = (
  metrics?: FairCertificationQuestionMetrics,
): FairQuestionResultNamedValue[] => {
  if (!metrics) {
    return [];
  }

  if (Array.isArray(metrics)) {
    return metrics
      .filter((entry): entry is {name: string; value: number} => hasMetricValue(entry.value))
      .map((entry) => ({name: entry.name, value: entry.value}));
  }

  return Object.entries(metrics)
    .filter((entry): entry is [string, number] => hasMetricValue(entry[1]))
    .map(([name, value]) => ({name, value}));
};
