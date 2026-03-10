import classNames from 'classnames';
import { Card, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import InfoTooltip from '@components/common/InfoTooltip';
import { Markdown, CrMessage } from '@core/core-ui';
import error from '@/assets/icons/errorPlaceholder.svg';
import success from '@/assets/icons/success.svg';
import info from '@/assets/icons/info.svg';
import './styles.css';

export interface IssueSection {
  items: unknown[];
  title: string;
  tooltip?: string;
  placeholder: string;
  countClassName?: string;
  hasItems: boolean;
  renderItems?: () => React.ReactNode;
}

export interface CrIssuesDisplayProps {
  className?: string;
  isLoading?: boolean;
  errorState?: {
    show: boolean;
    message: string;
    image?: string;
  };
  infoMessage?: {
    show: boolean;
    content: string | React.ReactNode;
    variant?: 'danger' | 'success' | 'warning' | 'info';
  };
  errorsSection?: IssueSection;
  warningsSection?: IssueSection;
}

export const CrIssuesDisplay: React.FC<CrIssuesDisplayProps> = ({
  className,
  isLoading = false,
  errorState,
  infoMessage,
  errorsSection,
  warningsSection,
}) => {
  const renderIssueSection = (section: IssueSection | undefined, isWarning = false) => {
    if (!section) return null;

    const { items, title, tooltip, placeholder, countClassName, hasItems, renderItems } = section;

    return (
      <div className="issue-wrapper">
        <div className="issue-title">
          <div className="issue-inner-wrapper">
            <div className={classNames('issue-count', countClassName, {
              'issue-count-red': isWarning,
            })}>
              {items.length}
            </div>
            <p className="issue-text">{title}</p>
          </div>
          {tooltip && <InfoTooltip title={tooltip} />}
        </div>
        {hasItems && renderItems ? (
          renderItems()
        ) : (
          <div className="issue-description">
            <img className="img" src={success} alt="" />
            <p className="error-text">{placeholder}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card
      className={classNames('content-wrapper', className, {
        'content-center': errorState?.show || isLoading,
      })}
    >
      {isLoading ? (
        <div className="data-spinner-wrapper-center">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
          <p className="spinner-text">Loading...</p>
        </div>
      ) : errorState?.show ? (
        <div className="error-wrapper">
          <img className="img" src={errorState.image || error} alt="" />
          <p className="error-text">{errorState.message}</p>
        </div>
      ) : (
        <div className="issue-outer-wrapper">
          {infoMessage?.show && (
            <CrMessage variant={infoMessage.variant || 'danger'} className="error-message">
              <img className="info-icon" src={info} alt="info" />
              {typeof infoMessage.content === 'string' ? (
                <Markdown className="message-text">{infoMessage.content}</Markdown>
              ) : (
                infoMessage.content
              )}
            </CrMessage>
          )}
          <div className="content-inner-wrapper">
            {renderIssueSection(errorsSection, false)}
            {renderIssueSection(warningsSection, true)}
          </div>
        </div>
      )}
    </Card>
  );
};
