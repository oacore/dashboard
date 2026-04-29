import {InfoOutlined, FileTextOutlined} from '@ant-design/icons';
import {Markdown, PercentBar} from '@oacore/core-ui';
import {Form, Input} from 'antd';
import {formatNumber} from '@utils/helpers.ts';

import type {FairQuestionItem} from '@features/Fair/types/fairPrinciples.types';
import {getFairQuestionStatusClassName} from '@features/Fair/utils/getFairQuestionStatusClassName';
import {
  resolveFairQuestionDisplay,
  type FairRepositoryStatusParams,
} from '@features/Fair/utils/resolveFairQuestionStatus';

import '../../Usrn/style.css';
import '../styles.css';

export type FairPrincipleQuestionBlockProps = {
  item: FairQuestionItem;
  recommendationHeading: string;
  openQuestionLabel: string;
  repositoryStatus?: FairRepositoryStatusParams | null;
};

export const FairPrincipleQuestionBlock = ({
  item,
  recommendationHeading,
  openQuestionLabel,
  repositoryStatus,
}: FairPrincipleQuestionBlockProps) => {
  const { statusLabel, cardConfig } = resolveFairQuestionDisplay({
    item,
    openQuestionLabel,
    repositoryStatus,
  });
  const displayStatus = statusLabel ?? '—';
  const statusClass = getFairQuestionStatusClassName(displayStatus);
  const isOpenQuestion = Boolean(item.openQuestion);

  const countCovered = cardConfig?.countCovered ?? null;
  const countTotal = cardConfig?.countTotal ?? null;
  const countValue = cardConfig?.countValue ?? null;
  const percentLabelText = item.percentLabel;
  const counterLabelText = item.counterLabel;

  const showPercentBar =
    countCovered != null &&
    countTotal != null &&
    countCovered > 0 &&
    countTotal > 0 &&
    Boolean(percentLabelText);

  const counterRows = cardConfig?.counterRows;
  const showCounterRows = Boolean(counterRows?.length);
  const showCountValue =
    !showCounterRows && countValue != null && Boolean(counterLabelText);

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
        <span className={`support-status__status ${statusClass}`}>{displayStatus}</span>
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

      {showCounterRows && counterRows
        ? counterRows.map((row, index) => (
            <div
              key={`${row.label}-${index}`}
              className="support-status__counter"
            >
              <span className="support-status__counter-label">{row.label}</span>
              <span className="support-status__counter-value">
                {formatNumber(row.value)}
              </span>
            </div>
          ))
        : null}
      {showCountValue ? (
        <div className="support-status__counter">
          <span className="support-status__counter-label">{counterLabelText}</span>
          <span className="support-status__counter-value">{formatNumber(countValue)}</span>
        </div>
      ) : null}

      {showPercentBar && percentLabelText ? (
        <PercentBar
          percentLabel={percentLabelText}
          countCovered={countCovered}
          countTotal={countTotal}
        />
      ) : null}

      {isOpenQuestion ? (
        <div className="fair-principles__open-block">
          <Form.Item className="fair-principles__open-field" name={item.id}>
            <Input.TextArea
              aria-label={`${item.code} ${item.question}. ${item.answerPlaceholder ?? ''}`}
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
