import type { FairCertificationQuestion } from '@features/Fair/types/fairCertification.types';
import { isFairOpenQuestion } from '@features/Fair/utils/isFairOpenQuestion';

const isFairQuestionAnswerFilled = (question: FairCertificationQuestion): boolean =>
  Boolean(question.answer?.answer?.trim());

export const getMissingFairQuestionNumbers = (
  questions: FairCertificationQuestion[] | undefined,
): string[] => {
  if (!questions?.length) {
    return [];
  }

  return [
    ...new Set(
      questions
        .filter(
          (question) =>
            Boolean(question.number) &&
            isFairOpenQuestion(question) &&
            !isFairQuestionAnswerFilled(question),
        )
        .map((question) => question.number),
    ),
  ];
};
