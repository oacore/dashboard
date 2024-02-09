import React from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { Icon } from '@oacore/design'

import ValidateCard from '../cards/validateCard'
import styles from '../styles.module.css'
import error from '../../../components/upload/assets/errorPlaceholder.svg'
import success from '../../../components/upload/assets/success.svg'
import texts from '../../../texts/validator'
import IssueCard from '../cards/issueCard'
import { Message } from '../../../design'
import info from '../../../components/upload/assets/info.svg'
import Actions from '../../../components/actions'

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
        <div className={styles.issueOuterWrapper}>
          {Object.keys(validationResult).length !== 0 && (
            <Message className={styles.dataErrorWrapper}>
              <img className={styles.infoIcon} src={info} alt="riox" />
              <p className={styles.versionText}>
                {`This record uses the RIOXX v${validationResult.rioxxVersion} application profile.`}
              </p>
            </Message>
          )}
          <div className={styles.issueInnerWrapper}>
            <div className={styles.issueWrapper}>
              <div className={styles.issueTitle}>
                <div className={styles.innerWrapper}>
                  <div className={styles.issueCount}>
                    {filteredIssue.length}
                  </div>
                  <p className={styles.issueText}>
                    {texts.validator.issues.issueTitle}
                  </p>
                </div>
                <Actions
                  description={texts.validator.issueTooltip}
                  hoverIcon={
                    <Icon
                      src="#alert-circle-outline"
                      style={{ color: '#757575' }}
                    />
                  }
                />
              </div>
              {Object.keys(validationResult).length !== 0 &&
              validationResult?.missingRequiredData.length !== 0 ? (
                <IssueCard validationList={filteredIssue} filteredIssue />
              ) : (
                <div className={styles.issueDescription}>
                  <img className={styles.img} src={success} alt="" />
                  <p className={styles.errorText}>
                    {texts.validator.issues.warningPlaceholder}
                  </p>
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
                <Actions
                  description={texts.validator.warningTooltip}
                  hoverIcon={
                    <Icon
                      src="#alert-circle-outline"
                      style={{ color: '#757575' }}
                    />
                  }
                />
              </div>
              {Object.keys(validationResult).length !== 0 &&
              validationResult?.missingOptionalData.length !== 0 ? (
                <IssueCard validationList={filteredWarning} filteredWarning />
              ) : (
                <div className={styles.issueDescription}>
                  <img className={styles.img} src={success} alt="" />
                  <p className={styles.errorText}>
                    {texts.validator.issues.placeholder}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  </>
)

export default RioxValidator
