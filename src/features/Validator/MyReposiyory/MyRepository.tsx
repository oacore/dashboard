import "../styles.css"
import validatorData from '../texts';
import ComplianceCard from '@features/Validator/cards/ComplianceCard.tsx';
import Markdown from '@components/common/Markdown/Markdown.js';
import InfoTooltip from '@components/common/InfoTooltip';

const MyRepository = () => (
  <>
    <ComplianceCard/>
    <article className="content-wrapper">
      <div className="issue-wrapper">
        <div className="issue-title">
          <div className="issue-inner-wrapper">
            <div className="issue-count">
              {/* {filterRepositoryData.length} */}
              0
            </div>
            <p className="issue-text">
              {validatorData.validator.issues.issueTitle}
            </p>
          </div>
            <InfoTooltip title={validatorData.validator.issueTooltip} />
        </div>
        <Markdown className="explain-text-header">
          {validatorData.validator.issueTooltip}
        </Markdown>
        <p className="explain-text">{validatorData.validator.issueDescription}</p>
      </div>
      <div className="issue-wrapper">
        <div className="issue-title">
          <div className="issue-inner-wrapper">
            <div className="issue-count-red">0</div>
            <p className="issue-text">
              {validatorData.validator.issues.warningTitle}
            </p>
          </div>
          <InfoTooltip title={validatorData.validator.warningTooltip} />
        </div>
        <Markdown className="explain-text-header">
          {validatorData.validator.warningTooltip}
        </Markdown>
        <p className="explain-text">
          {validatorData.validator.warningDescription}
        </p>
      </div>
    </article>
  </>
)

export default MyRepository
