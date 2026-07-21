import type {FairCertificationQuestionMetrics} from '@features/Fair/types/fairCertification.types';

const hasMetricValue = (value: number | null | undefined): value is number =>
  value != null && value !== 0;

export const resolveFairQuestionMetricValues = (
  metrics?: FairCertificationQuestionMetrics,
): number[] => {
  if (!metrics) {
    return [];
  }

  if (Array.isArray(metrics)) {
    return metrics
      .map((entry) => entry.value)
      .filter(hasMetricValue);
  }

  return Object.values(metrics).filter(hasMetricValue);
};
