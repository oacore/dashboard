import React, { useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import { Button } from '../../../design'
import moreInfo from '../../components/upload/assets/moreInfo.svg'
import menu from '../../components/upload/assets/menu.svg'
import styles from './styles.module.css'
import { validator } from '../../texts/validator'
import ValidateCard from './cards/validateCard'
import ComplianceCard from './cards/complianceCard'
import IssueCard from './cards/issueCard'

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
  issues,
  ...restProps
}) => {
  const [activeTab, setActiveTab] = useState('tab2')
  const [isValidated, setValidated] = useState(false)

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const handleValidateClick = () => {
    //  validation here
    setValidated(true)
  }

  return (
    <Tag
      className={classNames.use(styles.container).join(className)}
      {...restProps}
    >
      <header className={styles.header}>
        <div className={styles.validatorHeader}>
          <h1 className={styles.title}>{validator.title}</h1>
          <img className={styles.menu} src={menu} alt="" />
        </div>
        <p className={styles.description}>{validator.description}</p>
      </header>
      <div className={styles.validationField}>
        <div className={styles.tabWrapper}>
          <Button
            className={classNames.use(styles.tab, {
              [styles.activeTab]: activeTab === 'tab1',
            })}
            onClick={() => handleTabChange('tab1')}
          >
            {validator.validator.actions[0].name}
          </Button>
          <Button
            className={classNames.use(styles.tab, {
              [styles.activeTab]: activeTab === 'tab2',
            })}
            onClick={() => handleTabChange('tab2')}
          >
            {validator.validator.actions[1].name}
          </Button>
        </div>
        {activeTab === 'tab1' && <ComplianceCard />}
        {activeTab === 'tab2' && (
          <ValidateCard handleValidateClick={handleValidateClick} />
        )}
      </div>
      <article className={styles.contentWrapper}>
        <div className={styles.issueWrapper}>
          <div className={styles.issueTitle}>
            <div className={styles.innerWrapper}>
              <div className={styles.issueCount}>0</div>
              <p className={styles.issueText}>{validator.issues.issueTitle}</p>
            </div>
            <img className={styles.issueImage} src={moreInfo} alt="" />
          </div>
          {isValidated ? (
            <IssueCard />
          ) : (
            <div className={styles.issueDescription}>
              {validator.issues.placeholder}
            </div>
          )}
        </div>
        <div className={styles.issueWrapper}>
          <div className={styles.issueTitle}>
            <div className={styles.innerWrapper}>
              <div className={styles.issueCountRed}>0</div>
              <p className={styles.issueText}>
                {validator.issues.warningTitle}
              </p>
            </div>
            <img className={styles.issueImage} src={moreInfo} alt="" />
          </div>
          <div className={styles.issueDescription}>
            {validator.issues.placeholder}
          </div>
        </div>
      </article>
    </Tag>
  )
}

export default ValidatorPageTemplate
