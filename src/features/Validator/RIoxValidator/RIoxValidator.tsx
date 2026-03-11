import { ValidateCard } from '../cards/validateCard.tsx'
import { IssueCard } from '../cards/IssueCard.tsx'
import validatorData from "../texts"
import type { RioxValidatorProps } from '../types';
import "../styles.css"
import { CrIssuesDisplay } from '@oacore/core-ui';

const RioxValidator: React.FC<RioxValidatorProps> = ({
  handleValidateClick,
  validationResult,
  handleTextareaChange,
  recordValue,
  filteredIssue,
  filteredWarning,
}) => {
  const hasErrors = Object.keys(validationResult || {}).length !== 0 &&
    Object.keys(validationResult?.missingRequiredData || {}).length !== 0;

  const hasWarnings = Object.keys(validationResult || {}).length !== 0 &&
    Object.keys(validationResult?.missingOptionalData || {}).length !== 0;

  return (
    <>
      <ValidateCard
        handleValidateClick={handleValidateClick}
        validationResult={validationResult}
        handleTextareaChange={handleTextareaChange}
        recordValue={recordValue}
      />
      <CrIssuesDisplay
        errorState={{
          show: validationResult?.parseFailed || false,
          message: validatorData.validator.errorPlaceholder.text,
        }}
        infoMessage={
          Object.keys(validationResult || {}).length !== 0
            ? {
              show: true,
              content: `This record uses the RIOXX v${validationResult?.rioxxVersion} application profile.`,
            }
            : undefined
        }
        errorsSection={{
          items: filteredIssue,
          title: validatorData.validator.issues.issueTitle,
          tooltip: validatorData.validator.issueTooltip,
          placeholder: validatorData.validator.issues.placeholder,
          hasItems: hasErrors,
          renderItems: () => <IssueCard validationList={filteredIssue} filteredIssue />,
        }}
        warningsSection={{
          items: filteredWarning,
          title: validatorData.validator.issues.warningTitle,
          tooltip: validatorData.validator.warningTooltip,
          placeholder: validatorData.validator.issues.warningPlaceholder,
          hasItems: hasWarnings,
          renderItems: () => <IssueCard validationList={filteredWarning} filteredWarning />,
        }}
      />
    </>
  );
};

export default RioxValidator;
