import type {FairCertificationQuestionCounts} from '@features/Fair/types/fairCertification.types';

export type FairQuestionResultNamedValue = {
  name: string;
  value: number;
};

const hasCountValue = (value: number | null | undefined): value is number => value != null;

export const resolveFairQuestionCountValues = (
  counts?: FairCertificationQuestionCounts,
): FairQuestionResultNamedValue[] => {
  if (!counts) {
    return [];
  }

  if (Array.isArray(counts)) {
    return counts
      .filter((entry): entry is {name: string; value: number} => hasCountValue(entry.value))
      .map((entry) => ({name: entry.name, value: entry.value}));
  }

  return Object.entries(counts)
    .filter((entry): entry is [string, number] => hasCountValue(entry[1]))
    .map(([name, value]) => ({name, value}));
};
