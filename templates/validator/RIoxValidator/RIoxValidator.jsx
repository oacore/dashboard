import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import ValidateCard from '../cards/validateCard'
import styles from '../styles.module.css'
import error from '../../../components/upload/assets/errorPlaceholder.svg'
import texts from '../../../texts/validator'
import moreInfo from '../../../components/upload/assets/moreInfo.svg'
import IssueCard from '../cards/issueCard'

const RioxValidator = ({
  handleValidateClick,
  validationResult,
  handleTextareaChange,
  recordValue,
  filteredIssue,
  filteredWarning,
}) => (
  <>
    <ValidateCard
      handleValidateClick={handleValidateClick}
      validationResult={validationResult}
      handleTextareaChange={handleTextareaChange}
      recordValue={recordValue}
    />
    <article
      className={classNames.use(styles.contentWrapper, {
        [styles.contentCenter]: validationResult?.parseFailed,
      })}
    >
      {validationResult?.parseFailed ? (
        <div className={styles.errorWrapper}>
          <img className={styles.img} src={error} alt="" />
          <p className={styles.errorText}>
            {texts.validator.errorPlaceholder.text}
          </p>
        </div>
      ) : (
        <>
          <div className={styles.issueWrapper}>
            <div className={styles.issueTitle}>
              <div className={styles.innerWrapper}>
                <div className={styles.issueCount}>{filteredIssue.length}</div>
                <p className={styles.issueText}>
                  {texts.validator.issues.issueTitle}
                </p>
              </div>
              <img className={styles.issueImage} src={moreInfo} alt="" />
            </div>
            {Object.keys(validationResult).length !== 0 &&
            validationResult?.missingRequiredData.length !== 0 ? (
              <IssueCard validationList={filteredIssue} filteredIssue />
            ) : (
              <div className={styles.issueDescription}>
                {texts.validator.issues.placeholder}
              </div>
            )}
          </div>
          <div className={styles.issueWrapper}>
            <div className={styles.issueTitle}>
              <div className={styles.innerWrapper}>
                <div className={styles.issueCountRed}>
                  {filteredWarning.length}
                </div>
                <p className={styles.issueText}>
                  {texts.validator.issues.warningTitle}
                </p>
              </div>
              <img className={styles.issueImage} src={moreInfo} alt="" />
            </div>
            {Object.keys(validationResult).length !== 0 &&
            validationResult?.missingOptionalData.length !== 0 ? (
              <IssueCard validationList={filteredWarning} filteredWarning />
            ) : (
              <div className={styles.issueDescription}>
                {texts.validator.issues.placeholder}
              </div>
            )}
          </div>
        </>
      )}
    </article>
  </>
)

export default RioxValidator
