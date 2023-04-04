import React from 'react'

import ComplianceCard from '../cards/complianceCard'
import styles from '../styles.module.css'
import texts from '../../../texts/validator'
import Actions from '../../../components/actions'
import Markdown from '../../../components/markdown'

const MyRepository = ({ filterRepositoryData, repositoryData }) => (
  <>
    <ComplianceCard
      filterRepositoryData={filterRepositoryData}
      repositoryData={repositoryData}
    />
    <article className={styles.contentWrapper}>
      <div className={styles.issueWrapper}>
        <div className={styles.issueTitle}>
          <div className={styles.innerWrapper}>
            <div className={styles.issueCount}>
              {/*  // !!! WHEN RELEASE MY REPOSITORY UNCOMMENT !!! */}
              {/* {filterRepositoryData.length} */}0
            </div>
            <p className={styles.issueText}>
              {texts.validator.issues.issueTitle}
            </p>
          </div>
          <Actions description={texts.validator.issueTooltip} />
        </div>
        {/*  // !!! WHEN RELEASE MY REPOSITORY UNCOMMENT !!! */}
        {/* {filterRepositoryData.length !== 0 ? ( */}
        {/*  <IssueCard */}
        {/*    issueCount */}
        {/*    validationList={filterRepositoryData} */}
        {/*    filterRepositoryIssueData */}
        {/*  /> */}
        {/* ) : ( */}
        {/*  <div className={styles.issueDescription}> */}
        {/*    {texts.validator.issues.placeholder} */}
        {/*  </div> */}
        {/* )} */}

        {/* TEMP */}
        <Markdown className={styles.explainTextHeader}>
          {texts.validator.issueTooltip}
        </Markdown>
        <p className={styles.explainText}>{texts.validator.issueDescription}</p>
        {/* TEMP */}
      </div>
      <div className={styles.issueWrapper}>
        <div className={styles.issueTitle}>
          <div className={styles.innerWrapper}>
            <div className={styles.issueCountRed}>0</div>
            <p className={styles.issueText}>
              {texts.validator.issues.warningTitle}
            </p>
          </div>
          <Actions description={texts.validator.warningTooltip} />
        </div>
        {/* TEMP */}
        <Markdown className={styles.explainTextHeader}>
          {texts.validator.warningTooltip}
        </Markdown>
        <p className={styles.explainText}>
          {texts.validator.warningDescription}
        </p>
        {/* TEMP */}
      </div>
    </article>
  </>
)

export default MyRepository
