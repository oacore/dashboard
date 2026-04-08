import {FairPrincipleQuestionBlock} from '@features/Fair/components/FairPrincipleQuestionBlock';
import type {FairPrincipleSection} from '@features/Fair/types/fairPrinciples.types';

import '../styles.css';

export type FairPrincipleSectionContentProps = {
  section: FairPrincipleSection;
  recommendationHeading: string;
  openQuestionBadge: string;
};

export const FairPrincipleSectionContent = ({
  section,
  recommendationHeading,
  openQuestionBadge,
}: FairPrincipleSectionContentProps) => {
  if (!section.items?.length) {
    return null;
  }

  return (
    <div className="fair-principles__panel-body">
      {section.items.map((item) => (
        <FairPrincipleQuestionBlock
          item={item}
          key={item.id}
          openQuestionBadge={openQuestionBadge}
          recommendationHeading={recommendationHeading}
        />
      ))}
    </div>
  );
};
