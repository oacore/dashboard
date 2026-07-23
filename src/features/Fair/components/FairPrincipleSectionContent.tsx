import { useMemo } from 'react';

import {FairPrincipleQuestionBlock} from '@features/Fair/components/FairPrincipleQuestionBlock';
import type {FairPrincipleSection} from '@features/Fair/types/fairPrinciples.types';
// import type { FairRepositoryStatusParams } from '@features/Fair/utils/resolveFairQuestionStatus';

import '../styles.css';

export type FairPrincipleSectionContentProps = {
  section: FairPrincipleSection;
  recommendationHeading: string;
  openQuestionLabel: string;
  answerSavedMessage: string;
  answerSaveErrorMessage: string;
  // repositoryStatus?: FairRepositoryStatusParams | null;
};

export const FairPrincipleSectionContent = ({
  section,
  recommendationHeading,
  openQuestionLabel,
  answerSavedMessage,
  answerSaveErrorMessage,
  // repositoryStatus,
}: FairPrincipleSectionContentProps) => {
  const linkedQuestionNumbers = useMemo(
    () =>
      new Set(
        section.items
          .map((sectionItem) => sectionItem.linkedQuestionNumber)
          .filter((questionNumber): questionNumber is string => Boolean(questionNumber)),
      ),
    [section.items],
  );

  if (!section.items?.length) {
    return null;
  }

  return (
    <div className="fair-principles__panel-body">
      {section.items.map((item, index) => (
        <FairPrincipleQuestionBlock
          answerSavedMessage={answerSavedMessage}
          answerSaveErrorMessage={answerSaveErrorMessage}
          hasLinkedResultRow={item.number ? linkedQuestionNumbers.has(item.number) : false}
          item={item}
          key={item.id ? item.id : `${item.code || 'row'}-${index}`}
          recommendationHeading={recommendationHeading}
          openQuestionLabel={openQuestionLabel}
          // repositoryStatus={repositoryStatus}
        />
      ))}
    </div>
  );
};
