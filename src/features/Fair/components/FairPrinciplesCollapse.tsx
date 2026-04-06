import {DownOutlined} from '@ant-design/icons';
import fairTexts from '@features/Fair/texts/fair.json';
import {Button, Collapse, Form, Input, Typography} from 'antd';
import type {CollapseProps} from 'antd';
import {useMemo} from 'react';

import '../styles.css';

export type FairPrinciplesCollapseProps = {
  onSave?: () => void;
  onSubmit?: () => void;
};

const {Title, Paragraph} = Typography;

export const FairPrinciplesCollapse = ({
  onSave,
  onSubmit,
}: FairPrinciplesCollapseProps) => {
  const {principlesAccordion} = fairTexts;
  const [operationalForm] = Form.useForm();

  const handleSave = () => {
    onSave?.();
  };

  const handleSubmit = () => {
    onSubmit?.();
  };

  const collapseItems: CollapseProps['items'] = useMemo(
    () => [
      {
        key: 'findable',
        label: (
          <div className="fair-principles-collapse-label">
            <Title className="fair-principles-collapse-title" level={5}>
              {principlesAccordion.findable.title}
            </Title>
            <Paragraph className="fair-principles-collapse-desc">
              {principlesAccordion.findable.description}
            </Paragraph>
          </div>
        ),
        children: (
          <Paragraph className="fair-principles-collapse-body-text">
            {principlesAccordion.findable.expandedDetail}
          </Paragraph>
        ),
      },
      {
        key: 'accessible',
        label: (
          <div className="fair-principles-collapse-label">
            <Title className="fair-principles-collapse-title" level={5}>
              {principlesAccordion.accessible.title}
            </Title>
            <Paragraph className="fair-principles-collapse-desc">
              {principlesAccordion.accessible.description}
            </Paragraph>
          </div>
        ),
        children: (
          <Paragraph className="fair-principles-collapse-body-text">
            {principlesAccordion.accessible.expandedDetail}
          </Paragraph>
        ),
      },
      {
        key: 'interoperable',
        label: (
          <div className="fair-principles-collapse-label">
            <Title className="fair-principles-collapse-title" level={5}>
              {principlesAccordion.interoperable.title}
            </Title>
            <Paragraph className="fair-principles-collapse-desc">
              {principlesAccordion.interoperable.description}
            </Paragraph>
          </div>
        ),
        children: (
          <Paragraph className="fair-principles-collapse-body-text">
            {principlesAccordion.interoperable.expandedDetail}
          </Paragraph>
        ),
      },
      {
        key: 'reusable',
        label: (
          <div className="fair-principles-collapse-label">
            <Title className="fair-principles-collapse-title" level={5}>
              {principlesAccordion.reusable.title}
            </Title>
            <Paragraph className="fair-principles-collapse-desc">
              {principlesAccordion.reusable.description}
            </Paragraph>
          </div>
        ),
        children: (
          <Paragraph className="fair-principles-collapse-body-text">
            {principlesAccordion.reusable.expandedDetail}
          </Paragraph>
        ),
      },
      {
        key: 'fitForFunders',
        label: (
          <div className="fair-principles-collapse-label">
            <Title className="fair-principles-collapse-title" level={5}>
              {principlesAccordion.fitForFunders.title}
            </Title>
            <Paragraph className="fair-principles-collapse-desc">
              {principlesAccordion.fitForFunders.description}
            </Paragraph>
          </div>
        ),
        children: (
          <Paragraph className="fair-principles-collapse-body-text">
            {principlesAccordion.fitForFunders.expandedDetail}
          </Paragraph>
        ),
      },
      {
        key: 'fitForFuture',
        label: (
          <div className="fair-principles-collapse-label">
            <Title className="fair-principles-collapse-title" level={5}>
              {principlesAccordion.fitForFuture.title}
            </Title>
            <Paragraph className="fair-principles-collapse-desc">
              {principlesAccordion.fitForFuture.description}
            </Paragraph>
          </div>
        ),
        children: (
          <Paragraph className="fair-principles-collapse-body-text">
            {principlesAccordion.fitForFuture.expandedDetail}
          </Paragraph>
        ),
      },
      {
        key: 'operational',
        label: (
          <div className="fair-principles-collapse-label">
            <Title className="fair-principles-collapse-title" level={5}>
              {principlesAccordion.operational.title}
            </Title>
            <Paragraph className="fair-principles-collapse-desc">
              {principlesAccordion.operational.description}
            </Paragraph>
          </div>
        ),
        children: (
          <Form
            className="fair-principles-operational-form"
            form={operationalForm}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              label={principlesAccordion.operational.questionRepositoryPolicy}
              name="repositoryPolicy"
            >
              <Input.TextArea
                aria-label={principlesAccordion.operational.questionRepositoryPolicy}
                rows={3}
              />
            </Form.Item>
            <Form.Item
              label={principlesAccordion.operational.questionEnvironmental}
              name="environmentalConsiderations"
            >
              <Input.TextArea
                aria-label={principlesAccordion.operational.questionEnvironmental}
                rows={3}
              />
            </Form.Item>
          </Form>
        ),
      },
    ],
    [operationalForm, principlesAccordion],
  );

  const renderExpandIcon: NonNullable<CollapseProps['expandIcon']> = (panelProps) => {
    const isActive = Boolean(panelProps.isActive);
    return (
      <span aria-hidden className="fair-principles-collapse-expand-icon">
        <DownOutlined
          className="fair-principles-collapse-chevron"
          rotate={isActive ? 180 : 0}
        />
      </span>
    );
  };

  return (
    <section
      aria-label={principlesAccordion.sectionAriaLabel}
      className="fair-principles-accordion-section"
    >
      <Collapse
        bordered={false}
        className="fair-principles-collapse"
        defaultActiveKey={[]}
        expandIcon={renderExpandIcon}
        expandIconPlacement="end"
        ghost
        items={collapseItems}
      />
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
