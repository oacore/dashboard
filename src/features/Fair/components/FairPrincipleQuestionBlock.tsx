import {InfoOutlined, FileTextOutlined} from '@ant-design/icons';
import {Markdown, PercentBar} from '@oacore/core-ui';
import {Form, Input, message} from 'antd';
import {formatNumber} from '@utils/helpers.ts';
import type {FocusEvent} from 'react';

import type {FairQuestionItem} from '@features/Fair/types/fairPrinciples.types';
import { updateFairCertificationAnswer } from '@features/Fair/hooks/useFairCertification';
import { useDataProviderStore } from '@/store/dataProviderStore';

import '../../Usrn/style.css';
import '../styles.css';
import { getFairQuestionStatusClassName } from '@features/Fair/utils/getFairQuestionStatusClassName';
import { resolveFairQuestionStatusLabel } from '@features/Fair/utils/resolveFairQuestionStatusLabel';

export type FairPrincipleQuestionBlockProps = {
  item: FairQuestionItem;
  recommendationHeading: string;
  openQuestionLabel: string;
  // repositoryStatus?: FairRepositoryStatusParams | null;
};

export const FairPrincipleQuestionBlock = ({
  item,
  recommendationHeading,
  openQuestionLabel,
}: FairPrincipleQuestionBlockProps) => {
  const { selectedDataProvider } = useDataProviderStore();
  const dataProviderId = selectedDataProvider?.id;
  const isOpenQuestion = Boolean(item.openQuestion);
  const questionId = item.certificationQuestion?.id;

  const handleAnswerBlur = (event: FocusEvent<HTMLTextAreaElement>) => {
    if (!dataProviderId || !questionId) {
      return;
    }

    updateFairCertificationAnswer(dataProviderId, questionId, event.target.value).catch(() => {
      message.error('Failed to save your answer. Please try again.');
    });
  };

  const percentLabelText = item.percentLabel;
  const counterLabelText = item.counterLabel;
  const statusLabel = resolveFairQuestionStatusLabel(item.certificationQuestion, openQuestionLabel);
  const statusClassName = getFairQuestionStatusClassName(statusLabel);

  // TODO CHANGE TO REAL NUM
  return (
    <div className="support-status fair-principles__question">
      <div className="support-status__row">
        <div className="support-status__question-wrap">
          <p className="fair-principles__question-code">{item.code}</p>
          <h4 className="support-status__question">{item.question}</h4>
        </div>
        <span className="required-link">
          <FileTextOutlined  className="file-icon"/>
        </span>
        <span className={`support-status__status ${statusClassName}`}>{statusLabel}</span>
      </div>
      {item.description ? (
        <div className="support-status__row">
          <div className="support-status__description">
            <Markdown>{item.description}</Markdown>
            {item.statusNote ? (
              <p className="fair-principles__status-note" role="status">
                {item.statusNote}
              </p>
            ) : null}
          </div>
          <span aria-hidden className="support-status__status support-status__status--hidden" />
        </div>
      ) : null}

      {/*{showCounterRows && counterRows*/}
      {/*  ? counterRows.map((row, index) => (*/}
      {/*      <div*/}
      {/*        key={`${row.label}-${index}`}*/}
      {/*        className="support-status__counter"*/}
      {/*      >*/}
      {/*        <span className="support-status__counter-label">{row.label}</span>*/}
      {/*        <span className="support-status__counter-value">*/}
      {/*          {formatNumber(row.value)}*/}
      {/*        </span>*/}
      {/*      </div>*/}
      {/*    ))*/}
      {/*  : null}*/}

      <div className="support-status__counter">
        <span className="support-status__counter-label">{counterLabelText}</span>
        <span className="support-status__counter-value">{formatNumber(32)}</span>
      </div>

        <PercentBar
          percentLabel={percentLabelText}
          countCovered={3}
          countTotal={3}
        />
      {isOpenQuestion ? (
        <div className="fair-principles__open-block">
          <Form.Item
            className="fair-principles__open-field"
            initialValue={item.certificationQuestion?.answer}
            name={questionId ?? item.id}
          >
            <Input.TextArea
              aria-label={`${item.code} ${item.question}. ${item.answerPlaceholder ?? ''}`}
              onBlur={handleAnswerBlur}
              placeholder={item.answerPlaceholder ?? 'Write your answer here …'}
              rows={4}
            />
          </Form.Item>
        </div>
      ) : null}

      {item.recommendation ? (
        <div className="support-status__recommendation">
          <InfoOutlined className="support-status__recommendation-icon" aria-hidden />
          <div className="support-status__recommendation-content">
            <div className="support-status__recommendation-title">{recommendationHeading}</div>
            <div className="support-status__recommendation-text">
              <Markdown>{item.recommendation}</Markdown>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
