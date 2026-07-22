import { InfoOutlined, FileTextOutlined } from '@ant-design/icons';
import { Markdown, PercentBar } from '@oacore/core-ui';
import { Input, message, notification } from 'antd';
import { formatNumber } from '@utils/helpers.ts';
import type { FocusEvent } from 'react';

import type { FairQuestionItem } from '@features/Fair/types/fairPrinciples.types';
import { updateFairCertificationAnswer } from '@features/Fair/hooks/useFairCertification';
import { useDataProviderStore } from '@/store/dataProviderStore';

import '../styles.css';
import { formatFairResultName } from '@features/Fair/utils/formatFairResultName';
import { getFairQuestionStatusClassName } from '@features/Fair/utils/getFairQuestionStatusClassName';
import { resolveFairQuestionCountValues } from '@features/Fair/utils/resolveFairQuestionCountValues';
import { resolveFairQuestionMetricValues } from '@features/Fair/utils/resolveFairQuestionMetricValues';
import { isFairOpenQuestion } from '@features/Fair/utils/isFairOpenQuestion';
import { resolveFairQuestionStatusLabel } from '@features/Fair/utils/resolveFairQuestionStatusLabel';

export type FairPrincipleQuestionBlockProps = {
  item: FairQuestionItem;
  recommendationHeading: string;
  openQuestionLabel: string;
  answerSavedMessage: string;
  answerSaveErrorMessage: string;
  // repositoryStatus?: FairRepositoryStatusParams | null;
};

export const FairPrincipleQuestionBlock = ({
  item,
  recommendationHeading,
  openQuestionLabel,
  answerSavedMessage,
  answerSaveErrorMessage,
}: FairPrincipleQuestionBlockProps) => {
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const { selectedDataProvider } = useDataProviderStore();
  const dataProviderId = selectedDataProvider?.id;
  const isOpenQuestion = Boolean(item.number) && isFairOpenQuestion(item.certificationQuestion);
  const questionId = item.certificationQuestion?.id;

  const handleAnswerBlur = async (event: FocusEvent<HTMLTextAreaElement>) => {
    if (!dataProviderId || !questionId) {
      return;
    }

    const answer = event.target.value;
    const savedAnswer = item.certificationQuestion?.answer?.answer ?? '';

    if (answer === savedAnswer) {
      return;
    }

    try {
      await updateFairCertificationAnswer(dataProviderId, questionId, answer);
      notificationApi.success({
        title: answerSavedMessage,
        placement: 'bottomRight',
        duration: 2,
      });
    } catch {
      message.error(answerSaveErrorMessage);
    }
  };

  const showAutomaticResults = !isOpenQuestion && Boolean(item.certificationQuestion);
  const countValues = showAutomaticResults
    ? resolveFairQuestionCountValues(item.certificationQuestion?.result?.counts)
    : [];
  const metricValues = showAutomaticResults
    ? resolveFairQuestionMetricValues(item.certificationQuestion?.result?.metrics)
    : [];
  const statusLabel = isOpenQuestion
    ? openQuestionLabel
    : resolveFairQuestionStatusLabel(item.certificationQuestion);
  const statusClassName = getFairQuestionStatusClassName(statusLabel);

  return (
    <>
      {notificationContextHolder}
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

        {countValues.map((count) => (
          <div className="support-status__counter" key={`${item.id}-count-${count.name}`}>
            <span className="support-status__counter-label">{formatFairResultName(count.name)}</span>
            <span className="support-status__counter-value">{formatNumber(count.value)}</span>
          </div>
        ))}

        {metricValues.map((metric) => (
          <PercentBar
            countCovered={metric.value}
            countTotal={100}
            key={`${item.id}-metric-${metric.name}`}
            percentLabel={formatFairResultName(metric.name)}
          />
        ))}
        {isOpenQuestion ? (
          <>
            <div className="fair-principles__open-block">
              <Input.TextArea
                key={questionId ?? item.number ?? item.id}
                aria-label={`${item.code} ${item.question}. ${item.answerPlaceholder ?? ''}`}
                className="fair-principles__open-field"
                defaultValue={item.certificationQuestion?.answer?.answer ?? ''}
                disabled={!questionId}
                onBlur={handleAnswerBlur}
                placeholder={item.answerPlaceholder ?? 'Write your answer here …'}
                rows={4}
              />
            </div>
            {item.certificationQuestion?.answer?.answer && <div className="fair-principles-input-identifier">Last time edited {item.certificationQuestion?.answer?.editedDate} by {item.certificationQuestion?.answer?.editedBy} </div>}
          </>
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
    </>
  );
};
