import {InfoOutlined, FileTextOutlined} from '@ant-design/icons';
import {Markdown, PercentBar} from '@oacore/core-ui';
import {Input, message} from 'antd';
import {formatNumber} from '@utils/helpers.ts';
import type {FocusEvent} from 'react';

import type {FairQuestionItem} from '@features/Fair/types/fairPrinciples.types';
import {updateFairCertificationAnswer} from '@features/Fair/hooks/useFairCertification';
import {useDataProviderStore} from '@/store/dataProviderStore';

import '../../Usrn/style.css';
import '../styles.css';
import {getFairQuestionStatusClassName} from '@features/Fair/utils/getFairQuestionStatusClassName';
import {resolveFairQuestionCountValues} from '@features/Fair/utils/resolveFairQuestionCountValues';
import {resolveFairQuestionMetricValues} from '@features/Fair/utils/resolveFairQuestionMetricValues';
import {resolveFairQuestionStatusLabel} from '@features/Fair/utils/resolveFairQuestionStatusLabel';

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
  const {selectedDataProvider} = useDataProviderStore();
  const dataProviderId = selectedDataProvider?.id;
  const isOpenQuestion = Boolean(item.openQuestion);
  const questionId = item.certificationQuestion?.id;

  console.log(item.certificationQuestion?.id, "item.certificationQuestion?.id;")

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
  const countValues = resolveFairQuestionCountValues(item.certificationQuestion?.result?.counts);
  const metricValues = resolveFairQuestionMetricValues(item.certificationQuestion?.result?.metrics);
  const statusLabel = resolveFairQuestionStatusLabel(item.certificationQuestion, openQuestionLabel);
  const statusClassName = getFairQuestionStatusClassName(statusLabel);

  return (
    <div className="support-status fair-principles__question">
      <div className="support-status__row">
        <div className="support-status__question-wrap">
          <p className="fair-principles__question-code">{item.code}</p>
          <h4 className="support-status__question">{item.question}</h4>
        </div>
        <span className="required-link">
          <FileTextOutlined className="file-icon" />
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

      {countValues.map((countValue, index) => (
        <div className="support-status__counter" key={`${item.id}-count-${index}`}>
          {counterLabelText && index === 0 ? (
            <span className="support-status__counter-label">{counterLabelText}</span>
          ) : null}
          <span className="support-status__counter-value">{formatNumber(countValue)}</span>
        </div>
      ))}

      {metricValues.map((metricValue, index) => (
        <PercentBar
          countCovered={metricValue}
          countTotal={100}
          key={`${item.id}-metric-${index}`}
          percentLabel={percentLabelText && index === 0 ? percentLabelText : undefined}
        />
      ))}
      {isOpenQuestion ? (
        <div className="fair-principles__open-block">
          <Input.TextArea
            key={questionId ?? item.number ?? item.id}
            aria-label={`${item.code} ${item.question}. ${item.answerPlaceholder ?? ''}`}
            className="fair-principles__open-field"
            defaultValue={item.certificationQuestion?.answer ?? ''}
            disabled={!questionId}
            onBlur={handleAnswerBlur}
            placeholder={item.answerPlaceholder ?? 'Write your answer here …'}
            rows={4}
          />
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
