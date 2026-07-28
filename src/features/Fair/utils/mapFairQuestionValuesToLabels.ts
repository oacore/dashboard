import type { FairQuestionResultNamedValue } from '@features/Fair/utils/resolveFairQuestionCountValues';

export type FairQuestionLabeledValue = {
  label: string;
  value: number;
};

export const mapFairQuestionValuesToLabels = (
  values: FairQuestionResultNamedValue[],
  labels: string[],
): FairQuestionLabeledValue[] =>
  values.slice(0, labels.length).map(({ value }, index) => ({
    label: labels[index],
    value,
  }));
