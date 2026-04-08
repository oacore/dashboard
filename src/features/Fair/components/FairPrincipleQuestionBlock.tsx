import {InfoOutlined} from '@ant-design/icons';
import {Markdown} from '@oacore/core-ui';
import {Form, Input} from 'antd';

import type {FairQuestionItem} from '@features/Fair/types/fairPrinciples.types';
import {getFairQuestionStatusClassName} from '@features/Fair/utils/getFairQuestionStatusClassName';

import '../../Usrn/style.css';
import '../styles.css';

export type FairPrincipleQuestionBlockProps = {
  item: FairQuestionItem;
  recommendationHeading: string;
  openQuestionBadge: string;
};

export const FairPrincipleQuestionBlock = ({
  item,
  recommendationHeading,
  openQuestionBadge,
}: FairPrincipleQuestionBlockProps) => {
  const statusClass = getFairQuestionStatusClassName(item.statusLabel);
  const displayStatus = item.statusLabel ?? '—';
  const isOpenQuestion = Boolean(item.openQuestion);

  return (
    <div className="support-status fair-principles__question">
      <div className="support-status__row">
        <div className="support-status__question-wrap">
          <p className="fair-principles__question-code">{item.code}</p>
          <h4 className="support-status__question">{item.question}</h4>
        </div>
        <span className={`support-status__status ${statusClass}`}>{displayStatus}</span>
      </div>

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

      {/*TODO ADD BAR CHART IF HAVE*/}


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

      {isOpenQuestion ? (
        <div className="fair-principles__open-block">
          <span className="fair-principles__open-badge">{openQuestionBadge}</span>
          <Form.Item className="fair-principles__open-field" name={item.id}>
            <Input.TextArea
              aria-label={`${item.code} ${item.question}. ${item.answerPlaceholder ?? ''}`}
              placeholder={item.answerPlaceholder ?? 'Write your answer here …'}
              rows={4}
            />
          </Form.Item>
        </div>
      ) : null}
    </div>
  );
};
