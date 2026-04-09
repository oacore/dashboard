import fairTexts from '@features/Fair/texts/fair.json';
import {FairPrincipleSectionContent} from '@features/Fair/components/FairPrincipleSectionContent';
import {
  FairPrinciplesCollapsible,
  type FairPrinciplesCollapsibleSection,
} from '@features/Fair/components/FairPrinciplesCollapsible';
import {
  FAIR_PRINCIPLE_SECTION_KEYS,
  type FairPrincipleSection,
  type FairPrincipleSectionKey,
} from '@features/Fair/types/fairPrinciples.types';
import {Button, Form, Typography} from 'antd';
import {useMemo} from 'react';

import '../styles.css';

export type FairPrinciplesCollapseProps = {
  onSave?: () => void;
  onSubmit?: () => void;
  /** Collapsible presentation: `default` (full FAIR styling) or `compact` (tighter panels). */
  collapsibleVariant?: 'default' | 'compact';
};

const {Title, Paragraph} = Typography;

export const FairPrinciplesCollapse = ({
  onSave,
  onSubmit,
  collapsibleVariant = 'default',
}: FairPrinciplesCollapseProps) => {
  const {principlesAccordion} = fairTexts;
  const [openAnswersForm] = Form.useForm();

  const recommendationHeading = principlesAccordion.recommendationHeading ?? 'Recommendation';

  const handleSave = () => {
    onSave?.();
  };

  const handleSubmit = () => {
    onSubmit?.();
  };

  const collapsibleSections: FairPrinciplesCollapsibleSection[] = useMemo(() => {
    return FAIR_PRINCIPLE_SECTION_KEYS.map((key: FairPrincipleSectionKey) => {
      const section = principlesAccordion[key] as FairPrincipleSection;
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
            recommendationHeading={recommendationHeading}
            section={section}
          />
        ),
      };
    });
  }, [ principlesAccordion, recommendationHeading]);

  return (
    <section
      aria-label={principlesAccordion.sectionAriaLabel}
      className="fair-principles-accordion-section"
    >
      <Form className="fair-principles-open-form" form={openAnswersForm} layout="vertical" requiredMark={false}>
        <FairPrinciplesCollapsible
          defaultActiveKey={[]}
          sections={collapsibleSections}
          variant={collapsibleVariant}
        />
      </Form>
      <div className="fair-principles-accordion-actions">
        <Button
          aria-label={principlesAccordion.saveButtonLabel}
          className="fair-principles-accordion-btn fair-principles-accordion-btn--secondary"
          onClick={handleSave}
          type="default"
        >
          {principlesAccordion.saveButtonLabel}
        </Button>
        <Button
          aria-label={principlesAccordion.submitButtonLabel}
          className="fair-principles-accordion-btn fair-principles-accordion-btn--primary"
          htmlType="button"
          onClick={handleSubmit}
          type="primary"
        >
          {principlesAccordion.submitButtonLabel}
        </Button>
      </div>
    </section>
  );
};
