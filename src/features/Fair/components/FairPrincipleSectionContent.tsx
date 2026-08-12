import { FairPrincipleQuestionBlock } from '@features/Fair/components/FairPrincipleQuestionBlock';
import type { FairPrincipleSection } from '@features/Fair/types/fairPrinciples.types';
import { shouldShowFairQuestionResults } from '@features/Fair/utils/shouldShowFairQuestionResults';
// import type { FairRepositoryStatusParams } from '@features/Fair/utils/resolveFairQuestionStatus';

import '../styles.css';

export type FairPrincipleSectionContentProps = {
  section: FairPrincipleSection;
  recommendationHeading: string;
  openQuestionLabel: string;
  questionStatusErrorTooltip: string;
  questionStatusUnknownTooltip: string;
  questionStatusErrorHeading: string;
  questionStatusErrorMessage: string;
  answerSavedMessage: string;
  answerSaveErrorMessage: string;
  numericAnswerHint: string;
  // repositoryStatus?: FairRepositoryStatusParams | null;
};

export const FairPrincipleSectionContent = ({
  section,
  recommendationHeading,
  openQuestionLabel,
  questionStatusErrorTooltip,
  questionStatusUnknownTooltip,
  questionStatusErrorHeading,
  questionStatusErrorMessage,
  answerSavedMessage,
  answerSaveErrorMessage,
  numericAnswerHint,
  // repositoryStatus,
}: FairPrincipleSectionContentProps) => {
  if (!section.items?.length) {
    return null;
  }

  return (
    <div className="fair-principles__panel-body">
      {section.items.map((item, index) => (
        <FairPrincipleQuestionBlock
          answerSavedMessage={answerSavedMessage}
          answerSaveErrorMessage={answerSaveErrorMessage}
          numericAnswerHint={numericAnswerHint}
          item={item}
          showResultCounts={shouldShowFairQuestionResults(item, section.items)}
          key={item.id ? item.id : `${item.code || 'row'}-${index}`}
          recommendationHeading={recommendationHeading}
          openQuestionLabel={openQuestionLabel}
          questionStatusErrorTooltip={questionStatusErrorTooltip}
          questionStatusUnknownTooltip={questionStatusUnknownTooltip}
          questionStatusErrorHeading={questionStatusErrorHeading}
          questionStatusErrorMessage={questionStatusErrorMessage}
        // repositoryStatus={repositoryStatus}
        />
      ))}
    </div>
  );
};
