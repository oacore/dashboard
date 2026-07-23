import type { FairQuestionItem } from '@features/Fair/types/fairPrinciples.types';
import { isFairOpenQuestion } from '@features/Fair/utils/isFairOpenQuestion';

export const shouldShowFairQuestionResults = (
  item: FairQuestionItem,
  sectionItems: FairQuestionItem[],
): boolean => {
  if (!item.certificationQuestion) {
    return false;
  }

  if (item.linkedQuestionNumber) {
    return true;
  }

  const isOpenQuestion =
    Boolean(item.number) && isFairOpenQuestion(item.certificationQuestion);

  if (!isOpenQuestion) {
    return true;
  }

  const defersResultsToLinkedRow = sectionItems.some(
    (sectionItem) => sectionItem.linkedQuestionNumber === item.number,
  );

  return !defersResultsToLinkedRow;
};
