import { ExclamationCircleFilled, InfoOutlined, FileTextOutlined } from '@ant-design/icons';
import { Markdown, PercentBar } from '@oacore/core-ui';
import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import { Input, message, notification, Tooltip } from 'antd';
import { formatNumber } from '@utils/helpers.ts';

import type { FairQuestionItem } from '@features/Fair/types/fairPrinciples.types';
import { useFairCertification } from '@features/Fair/hooks/useFairCertification';
import { useDataProviderStore } from '@/store/dataProviderStore';

import '../styles.css';
import { getFairQuestionStatusClassName } from '@features/Fair/utils/getFairQuestionStatusClassName';
import { mapFairQuestionValuesToLabels } from '@features/Fair/utils/mapFairQuestionValuesToLabels';
import { resolveFairQuestionCountValues } from '@features/Fair/utils/resolveFairQuestionCountValues';
import { resolveFairQuestionMetricValues } from '@features/Fair/utils/resolveFairQuestionMetricValues';
import { isFairOpenQuestion } from '@features/Fair/utils/isFairOpenQuestion';
import { resolveFairQuestionStatus } from '@features/Fair/utils/resolveFairQuestionStatus';
import {
  normalizeFairAnswer,
  numericAnswerInputProps,
} from '@features/Fair/utils/numericAnswerInput';

export type FairPrincipleQuestionBlockProps = {
  item: FairQuestionItem;
  showResultCounts?: boolean;
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

export const FairPrincipleQuestionBlock = ({
  item,
  showResultCounts = false,
  recommendationHeading,
  openQuestionLabel,
  questionStatusErrorTooltip,
  questionStatusUnknownTooltip,
  questionStatusErrorHeading,
  questionStatusErrorMessage,
  answerSavedMessage,
  answerSaveErrorMessage,
  numericAnswerHint,
}: FairPrincipleQuestionBlockProps) => {
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const { selectedDataProvider } = useDataProviderStore();
  const { saveAnswer } = useFairCertification();
  const dataProviderId = selectedDataProvider?.id;
  const isOpenQuestion = Boolean(item.number) && isFairOpenQuestion(item.certificationQuestion);
  const questionId = item.certificationQuestion?.id;

  const isNumericAnswer = Boolean(item.numericAnswer);
  const rawSavedAnswer = item.certificationQuestion?.answer?.answer ?? '';
  const savedAnswer = normalizeFairAnswer(rawSavedAnswer, isNumericAnswer);
  const [answerValue, setAnswerValue] = useState(savedAnswer);

  useEffect(() => {
    setAnswerValue(savedAnswer);
  }, [savedAnswer]);

  const handleAnswerChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerValue(normalizeFairAnswer(event.target.value, isNumericAnswer));
  }, [isNumericAnswer]);

  const handleAnswerBlur = useCallback(async () => {
    if (!dataProviderId || !questionId || answerValue === savedAnswer) {
      return;
    }

    try {
      await saveAnswer(questionId, answerValue);
      notificationApi.success({
        title: answerSavedMessage,
        placement: 'bottomRight',
        duration: 2,
      });
    } catch {
      message.error(answerSaveErrorMessage);
    }
  }, [
    answerSavedMessage,
    answerSaveErrorMessage,
    answerValue,
    dataProviderId,
    notificationApi,
    questionId,
    saveAnswer,
    savedAnswer,
  ]);

  const countValues = showResultCounts
    ? mapFairQuestionValuesToLabels(
      resolveFairQuestionCountValues(item.certificationQuestion?.result?.counts),
      item.counterLabels ?? [],
    )
    : [];
  const metricValues = showResultCounts
    ? mapFairQuestionValuesToLabels(
      resolveFairQuestionMetricValues(item.certificationQuestion?.result?.metrics),
      item.percentLabels ?? [],
    )
    : [];
  const questionStatus = isOpenQuestion
    ? null
    : resolveFairQuestionStatus(item.certificationQuestion);
  const hasErrorStatus = questionStatus?.key === 'error';
  const shouldShowPercentBar =
    !item.linkedQuestionNumber ||
    Boolean(normalizeFairAnswer(item.certificationQuestion?.answer?.answer ?? '', true));

  const renderQuestionStatus = () => {
    if (isOpenQuestion) {
      return (
        <span className="support-status__status support-status__status--open">
          {openQuestionLabel}
        </span>
      );
    }

    if (!questionStatus) {
      return null;
    }

    const statusClassName = getFairQuestionStatusClassName(questionStatus.key);

    if (questionStatus.key === 'error') {
      return (
        <Tooltip title={questionStatusErrorTooltip}>
          <span
            aria-label={questionStatusErrorTooltip}
            className={`support-status__status ${statusClassName}`}
            role="img"
            tabIndex={0}
          >
            <ExclamationCircleFilled aria-hidden />
          </span>
        </Tooltip>
      );
    }

    if (questionStatus.key === 'unknown') {
      return (
        <Tooltip title={questionStatusUnknownTooltip}>
          <span
            aria-label={`${questionStatus.label}. ${questionStatusUnknownTooltip}`}
            className={`support-status__status ${statusClassName} support-status__status--na`}
            tabIndex={0}
          >
            {questionStatus.label}
          </span>
        </Tooltip>
      );
    }

    return (
      <span
        className={`support-status__status ${statusClassName}${questionStatus.key === 'na' ? ' support-status__status--na' : ''}`}
      >
        {questionStatus.label}
      </span>
    );
  };

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
          {renderQuestionStatus()}
        </div>
        {item.description ? (
          <div className="support-status__row">
            <div className="support-status__description">
              <Markdown>{item.description}</Markdown>
            </div>
            <span aria-hidden className="support-status__status support-status__status--hidden" />
          </div>
        ) : null}

        {hasErrorStatus ? (
          <div className="fair-principles__error-section" role="alert">
            <ExclamationCircleFilled
              aria-hidden
              className="fair-principles__error-section-icon"
            />
            <div className="fair-principles__error-section-content">
              <div className="fair-principles__error-section-title">
                {questionStatusErrorHeading}
              </div>
              <p className="fair-principles__error-section-text">
                {questionStatusErrorMessage}
              </p>
            </div>
          </div>
        ) : null}

        {!hasErrorStatus && countValues.map((count, index) => (
          <div className="support-status__counter" key={`${item.id}-count-${index}`}>
            <span className="support-status__counter-label">{count.label}</span>
            <span className="support-status__counter-value">{formatNumber(count.value)}</span>
          </div>
        ))}

        {!hasErrorStatus && shouldShowPercentBar && metricValues.map((metric, index) => (
          <PercentBar
            countCovered={metric.value}
            countTotal={100}
            key={`${item.id}-metric-${index}`}
            percentLabel={metric.label}
          />
        ))}
        {isOpenQuestion ? (
          <>
            <div className="fair-principles__open-block">
              <Input.TextArea
                aria-describedby={isNumericAnswer ? `${item.id}-numeric-hint` : undefined}
                aria-label={`${item.code} ${item.question}. ${item.answerPlaceholder ?? ''}`}
                className="fair-principles__open-field"
                disabled={!questionId}
                onBlur={handleAnswerBlur}
                onChange={handleAnswerChange}
                placeholder={item.answerPlaceholder ?? 'Write your answer here …'}
                rows={4}
                value={answerValue}
                {...(isNumericAnswer ? numericAnswerInputProps : {})}
              />
              {isNumericAnswer ? (
                <p
                  className="fair-principles__open-field-hint"
                  id={`${item.id}-numeric-hint`}
                >
                  {numericAnswerHint}
                </p>
              ) : null}
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
