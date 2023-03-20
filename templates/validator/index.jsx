import React, { useEffect, useMemo, useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { useRouter } from 'next/router'

import { Button } from '../../../design'
import moreInfo from '../../components/upload/assets/moreInfo.svg'
import menu from '../../components/upload/assets/menu.svg'
import styles from './styles.module.css'
import ValidateCard from './cards/validateCard'
import ComplianceCard from './cards/complianceCard'
import IssueCard from './cards/issueCard'
import error from '../../components/upload/assets/errorPlaceholder.svg'

import texts from 'texts/validator'

const ValidatorPageTemplate = ({
  tag: Tag = 'main',
  className,
  harvestingStatus,
  issuesByType,
  aggregation,
  date,
  errorsCount,
  warningCount,
  metadataCount,
  fullTextCount,
  total,
  downloadResults,
  rioxValidation,
  repositoryValidator,
  validationResult,
  handleTextareaChange,
  recordValue,
  issues,
  ...restProps
}) => {
  const [activeTab, setActiveTab] = useState('tab2')
  const [filteredWarning, setFilteredWarning] = useState([])
  const [filteredIssue, setFilteredIssue] = useState([])

  const router = useRouter()

  const id = router.query['data-provider-id']

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const handleValidateClick = () => {
    rioxValidation(id)
  }

  const issueList = useMemo(
    () => texts.actions.filter((item) => item.severity === 'ERROR'),
    [texts.actions]
  )

  const warningList = useMemo(
    () => texts.actions.filter((item) => item.severity === 'WARNING'),
    [texts.actions]
  )

  useEffect(() => {
    const list = issueList.filter((item) =>
      Object.keys(validationResult.missingRequiredData || {})
        .map((issue) => issue.toLowerCase())
        .includes(item.key.toLowerCase())
    )
    setFilteredIssue(list)
  }, [validationResult.missingRequiredData])

  useEffect(() => {
    const list = warningList.filter((item) =>
      Object.keys(validationResult.missingOptionalData || {})
        .map((issue) => issue.toLowerCase())
        .includes(item.key.toLowerCase())
    )
    setFilteredWarning(list)
  }, [validationResult.missingOptionalData])

  return (
    <Tag
      className={classNames.use(styles.container).join(className)}
      {...restProps}
    >
      <header className={styles.header}>
        <div className={styles.validatorHeader}>
          <h1 className={styles.title}>{texts.validator.title}</h1>
          <img className={styles.menu} src={menu} alt="" />
        </div>
        <p className={styles.description}>{texts.validator.description}</p>
      </header>
      <div className={styles.validationField}>
        <div className={styles.tabWrapper}>
          <Button
            className={classNames.use(styles.tab, {
              [styles.activeTab]: activeTab === 'tab1',
            })}
            onClick={() => handleTabChange('tab1')}
          >
            {texts.validator.validator.actions[0].name}
          </Button>
          <Button
            className={classNames.use(styles.tab, {
              [styles.activeTab]: activeTab === 'tab2',
            })}
            onClick={() => handleTabChange('tab2')}
          >
            {texts.validator.validator.actions[1].name}
          </Button>
        </div>
        {activeTab === 'tab1' && <ComplianceCard />}
        {activeTab === 'tab2' && (
          <ValidateCard
            handleValidateClick={handleValidateClick}
            validationResult={validationResult}
            handleTextareaChange={handleTextareaChange}
            recordValue={recordValue}
          />
        )}
      </div>
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
                  <div className={styles.issueCount}>
                    {filteredIssue.length}
                  </div>
                  <p className={styles.issueText}>
                    {texts.validator.issues.issueTitle}
                  </p>
                </div>
                <img className={styles.issueImage} src={moreInfo} alt="" />
              </div>
              {Object.keys(validationResult).length !== 0 &&
              validationResult?.missingOptionalData.length === 0 ? (
                <IssueCard
                  data={validationResult?.missingOptionalData}
                  validationList={filteredIssue}
                />
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
              validationResult?.missingRequiredData.length === 0 ? (
                <IssueCard
                  data={validationResult?.missingRequiredData}
                  validationList={filteredWarning}
                />
              ) : (
                <div className={styles.issueDescription}>
                  {texts.validator.issues.placeholder}
                </div>
              )}
            </div>
          </>
        )}
      </article>
    </Tag>
  )
}

export default ValidatorPageTemplate
