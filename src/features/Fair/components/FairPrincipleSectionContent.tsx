import {FairPrincipleQuestionBlock} from '@features/Fair/components/FairPrincipleQuestionBlock';
import type {FairPrincipleSection} from '@features/Fair/types/fairPrinciples.types';
import type { FairRepositoryStatusParams } from '@features/Fair/utils/resolveFairQuestionStatus';

import '../styles.css';

export type FairPrincipleSectionContentProps = {
  section: FairPrincipleSection;
  recommendationHeading: string;
  openQuestionLabel: string;
  repositoryStatus?: FairRepositoryStatusParams | null;
};

export const FairPrincipleSectionContent = ({
  section,
  recommendationHeading,
  openQuestionLabel,
  repositoryStatus,
}: FairPrincipleSectionContentProps) => {
  if (!section.items?.length) {
    return null;
  }

  return (
    <div className="fair-principles__panel-body">
      {section.items.map((item, index) => (
        <FairPrincipleQuestionBlock
          item={item}
          key={item.id ? item.id : `${item.code || 'row'}-${index}`}
          recommendationHeading={recommendationHeading}
          openQuestionLabel={openQuestionLabel}
          repositoryStatus={repositoryStatus}
        />
      ))}
    </div>
  );
};
