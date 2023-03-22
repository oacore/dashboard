import React from 'react'

import ComplianceCard from '../cards/complianceCard'
import styles from '../styles.module.css'
import texts from '../../../texts/validator'
import moreInfo from '../../../components/upload/assets/moreInfo.svg'
import IssueCard from '../cards/issueCard'

const MyRepository = ({ filterRepositoryData }) => (
  <>
    <ComplianceCard />
    <article className={styles.contentWrapper}>
      <div className={styles.issueWrapper}>
        <div className={styles.issueTitle}>
          <div className={styles.innerWrapper}>
            <div className={styles.issueCount}>
              {filterRepositoryData.length}
            </div>
            <p className={styles.issueText}>
              {texts.validator.issues.issueTitle}
            </p>
          </div>
          <img className={styles.issueImage} src={moreInfo} alt="" />
        </div>
        {filterRepositoryData.length !== 0 ? (
          <IssueCard
            issueCount
            validationList={filterRepositoryData}
            filterRepositoryIssueData
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
            <div className={styles.issueCountRed}>0</div>
            <p className={styles.issueText}>
              {texts.validator.issues.warningTitle}
            </p>
          </div>
          <img className={styles.issueImage} src={moreInfo} alt="" />
        </div>
        <div className={styles.issueDescription}>No warnings found yet</div>
      </div>
    </article>
  </>
)

export default MyRepository
