import classNames from 'classnames';

import "../styles.css"
import type { IssueCardProps } from '../types';
import {
  WarningFilled, WechatFilled
} from '@ant-design/icons';


export const IssueCard: React.FC<IssueCardProps> = ({
  validationList,
  issueCount,
  filteredWarning,
  filteredIssue,
  filterRepositoryIssueData,
}) => (
  <div>
    {validationList &&
      validationList?.map(
        ({
          title,
          description,
          resolution,
          severity,
          key,
          outputsCount,
          elementName,
          messages,
        }, index) => (
          <div
            key={title || elementName || key || index}
            className="validation-list-item"
          >
            <div className="validation-card-section">
              <div className="type-card-header">
                <WarningFilled
                  className={classNames({
                    "card-icon-warning": filteredWarning,
                    "card-icon-error": filteredIssue || filterRepositoryIssueData,
                  })}
                />
                <h3 className="type-card-title">
                  {title || elementName || key}
                </h3>
              </div>
              <p className="validation-card-text">
                {description ||
                  (Array.isArray(messages) ? messages.join(', ') : messages) ||
                  `Missing element ${elementName || key}`}
              </p>
              {issueCount && outputsCount && (
                <div className="count-wrapper">
                  <div
                    className={classNames('count', {
                      'card-warning': severity === 'WARNING',
                      'card-error': filterRepositoryIssueData,
                    })}
                  >
                    {outputsCount.toLocaleString()}
                  </div>
                  <div
                    className={classNames('warning-description', {
                      'card-warning-background': severity === 'WARNING',
                      'card-error-background': filterRepositoryIssueData,
                    })}
                  >
                    records are affected by this issue.
                  </div>
                </div>
              )}
              <div>
                <div className="type-card-header">
                  <WechatFilled className="card-icon-comment" />
                  <h3 className="type-card-title">Recommendation</h3>
                </div>
                <p className="recomendation-text">{resolution || `No recommendations yet`}</p>
              </div>
            </div>
          </div>
        )
      )}
  </div>
)


