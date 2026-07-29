import fairTexts from '@features/Fair/texts/fair.json';
import { FairPrincipleSectionContent } from '@features/Fair/components/FairPrincipleSectionContent';
import {
  FairPrinciplesCollapsible,
  type FairPrinciplesCollapsibleSection,
} from '@features/Fair/components/FairPrinciplesCollapsible';
import type { FairCertificationQuestion } from '@features/Fair/types/fairCertification.types';
import {
  FAIR_PRINCIPLE_SECTION_KEYS,
  type FairPrincipleSection,
  type FairPrincipleSectionKey,
  type FairQuestionItem,
} from '@features/Fair/types/fairPrinciples.types';
// import type { FairRepositoryStatusParams } from '@features/Fair/utils/resolveFairQuestionStatus';
import { Button, Typography } from 'antd';
import { useMemo } from 'react';

import '../styles.css';

export type FairPrinciplesCollapseProps = {
  onSave?: () => void;
  onSubmit?: () => void | Promise<void>;
  isSubmitting?: boolean;
  /** Collapsible presentation: `default` (full FAIR styling) or `compact` (tighter panels). */
  collapsibleVariant?: 'default' | 'compact';
  certificationQuestions?: FairCertificationQuestion[];
  /** When set, principle rows with a USRN mapping show Yes/No from the same APIs as USRN. */
  // repositoryStatus?: FairRepositoryStatusParams | null;
};

const { Title, Paragraph } = Typography;

export const FairPrinciplesCollapse = ({
  onSubmit,
  isSubmitting = false,
  collapsibleVariant = 'default',
  certificationQuestions,
  // repositoryStatus,
}: FairPrinciplesCollapseProps) => {
  const { principlesAccordion } = fairTexts;

  const recommendationHeading = principlesAccordion.recommendationHeading ?? 'Recommendation';


  const handleSubmit = () => {
    void onSubmit?.();
  };

  const collapsibleSections: FairPrinciplesCollapsibleSection[] = useMemo(() => {
    const questionsByNumber = certificationQuestions?.length
      ? new Map(
        certificationQuestions
          .filter((question) => question.number)
          .map((question) => [question.number as string, question]),
      )
      : undefined;

    const attachCertificationQuestion = (item: FairQuestionItem): FairQuestionItem => {
      if (!questionsByNumber) {
        return item;
      }

      const questionNumber = item.number ?? item.linkedQuestionNumber;
      const certificationQuestion = questionNumber
        ? questionsByNumber.get(questionNumber)
        : undefined;

      return certificationQuestion ? { ...item, certificationQuestion } : item;
    };

    return FAIR_PRINCIPLE_SECTION_KEYS.map((key: FairPrincipleSectionKey) => {
      const section = principlesAccordion[key] as FairPrincipleSection;
      const enrichedSection: FairPrincipleSection = {
        ...section,
        items: section.items.map(attachCertificationQuestion),
      };

      return {
        key,
        label: (
          <div className="fair-principles-collapse-label">
            <Title className="fair-principles-collapse-title" level={5}>
              {section.title}
            </Title>
            <Paragraph className="fair-principles-collapse-desc">{section.description}</Paragraph>
          </div>
        ),
        children: (
          <FairPrincipleSectionContent
            answerSavedMessage={principlesAccordion.answerSavedMessage}
            answerSaveErrorMessage={principlesAccordion.answerSaveErrorMessage}
            recommendationHeading={recommendationHeading}
            section={enrichedSection}
            openQuestionLabel={principlesAccordion.openQuestionBadge}
            questionStatusErrorTooltip={principlesAccordion.questionStatusErrorTooltip}
            questionStatusUnknownTooltip={principlesAccordion.questionStatusUnknownTooltip}
          />
        ),
      };
    });
  }, [principlesAccordion, recommendationHeading, certificationQuestions]);


  return (
    <section
      aria-label={principlesAccordion.sectionAriaLabel}
      className="fair-principles-accordion-section"
    >
      <FairPrinciplesCollapsible
        defaultActiveKey={[]}
        sections={collapsibleSections}
        variant={collapsibleVariant}
      />
      <div className="fair-principles-accordion-actions">
        <Button
          aria-label={principlesAccordion.submitButtonLabel}
          className="fair-principles-accordion-btn fair-principles-accordion-btn--primary"
          disabled={isSubmitting}
          htmlType="button"
          loading={isSubmitting}
          onClick={handleSubmit}
          type="primary"
        >
          {principlesAccordion.submitButtonLabel}
        </Button>
      </div>
    </section>
  );
};

