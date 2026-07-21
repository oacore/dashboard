import type {FairCertificationQuestionCounts} from '@features/Fair/types/fairCertification.types';

export const resolveFairQuestionCountValues = (
  counts?: FairCertificationQuestionCounts,
): number[] => {
  if (!counts) {
    return [];
  }

  if (Array.isArray(counts)) {
    return counts
      .map((entry) => entry.value)
      .filter((value): value is number => value != null);
  }

  return Object.values(counts).filter((value): value is number => value != null);
};
