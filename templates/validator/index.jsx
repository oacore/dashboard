import React, { useEffect, useMemo, useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { useRouter } from 'next/router'

import menu from '../../components/upload/assets/menu.svg'
import info from '../../components/upload/assets/info.svg'
import styles from './styles.module.css'
import RioxValidator from './RIoxValidator/RIoxValidator'
import MyRepository from './MyReposiyory/myRepository'
import { Icon, Link, Message } from '../../design'
import Markdown from '../../components/markdown'

import { Button } from 'design'
import texts from 'texts/validator'

const TABS = {
  myRepository: 'myRepositoryTab',
  validation: 'validationTab',
}

const SUPPORT_EMAIL_URL = 'mailto:t%68%65t%65am%40core%2e%61c%2eu%6b'
const SUPPORT_EMAIL = decodeURIComponent(
  SUPPORT_EMAIL_URL.slice('mailto:'.length)
)

const NotEnoughDataMessage = () => (
  <Message className={styles.dataErrorWrapper}>
    <Icon className={styles.errorIcon} src="#alert-outline" /> Your repository
    is not configured to expose RIOXX guidelines. For more information contact
    us at
    <Link className={styles.link} href={SUPPORT_EMAIL_URL}>
      {SUPPORT_EMAIL}
    </Link>
    .
  </Message>
)

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
  rioxxCompliance,
  repositoryValidator,
  validationResult,
  handleTextareaChange,
  recordValue,
  issues,
  ...restProps
}) => {
  const [activeTab, setActiveTab] = useState(TABS.validation)
  const [filteredWarning, setFilteredWarning] = useState([])
  const [filteredIssue, setFilteredIssue] = useState([])

  // !!! WHEN RELEASE MY REPOSITORY UNCOMMENT !!!

  // const [repositoryData, setrepositoryData] = useState([])
  // eslint-disable-next-line max-len
  // const [filterRepositoryIssueData, setFilterRepositoryIssueData] = useState([])

  const router = useRouter()

  const id = router.query['data-provider-id']

  const handleTabChange = async (tab) => {
    setActiveTab(tab)
    // !!! WHEN RELEASE MY REPOSITORY UNCOMMENT !!!

    // if (activeTab === TABS.validation) {
    //   const data = await repositoryValidator(id)
    //   setrepositoryData(data)
    // }
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

  function filterList(list, missingData) {
    const filteredList = list.filter((item) =>
      Object.keys(missingData || {})
        .map((issue) => issue.toLowerCase())
        .includes(item.key.toLowerCase())
    )

    const dataKeys = Object.keys(missingData || {})
    const foundData = filteredList.map((item) => item.key.toLowerCase())
    const mismatchedDataKeys = dataKeys?.filter(
      (key) => !foundData.includes(key.toLowerCase())
    )
    const mismatchedData = Object.fromEntries(
      // eslint-disable-next-line no-unused-vars
      Object.entries(missingData || {}).filter(([key, _]) =>
        mismatchedDataKeys.some(
          (mismatchedKey) =>
            mismatchedKey.localeCompare(key, undefined, {
              sensitivity: 'accent',
            }) === 0
        )
      )
    )
    const mismatchedArray = Object.entries(mismatchedData).map(
      ([key, value]) => ({
        key,
        messages: value,
      })
    )

    return [...filteredList, ...mismatchedArray]
  }

  useEffect(() => {
    const finalData = filterList(
      issueList,
      validationResult.missingRequiredData
    )
    setFilteredIssue(finalData)
  }, [validationResult.missingRequiredData])

  useEffect(() => {
    const finalData = filterList(
      warningList,
      validationResult.missingOptionalData
    )
    setFilteredWarning(finalData)
  }, [validationResult.missingOptionalData])

  // !!! WHEN RELEASE MY REPOSITORY UNCOMMENT !!!

  // useEffect(() => {
  //   const repositoryList = issueList.filter((item) =>
  //     repositoryData.missingTermsBasic?.find(
  //       (issue) => item.key.toLowerCase() === issue.elementName.toLowerCase()
  //     )
  //   )
  //
  //   const updatedIssueList = repositoryList.map((obj) => {
  //     const result = repositoryData.missingTermsBasic.find(
  // eslint-disable-next-line max-len
  //       (element) => element.elementName.toLowerCase() === obj.key.toLowerCase()
  //     )
  //
  //     return {
  //       ...obj,
  //       outputsCount: result.outputsCount,
  //     }
  //   })
  //
  //   const filteredData =
  //     repositoryData.missingTermsBasic?.filter(
  //       (item) =>
  //         !updatedIssueList?.some(
  // eslint-disable-next-line max-len
  //           (obj) => obj?.key?.toLowerCase() === item.elementName.toLowerCase()
  //         )
  //     ) ?? []
  //
  //   setFilterRepositoryIssueData([...updatedIssueList, ...filteredData])
  // }, [repositoryData.missingTermsBasic])

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
      {rioxxCompliance != null && rioxxCompliance.totalCount > 0 ? (
        <>
          <Message className={styles.dataErrorWrapper}>
            <img className={styles.infoIcon} src={info} alt="riox" />
            <Markdown className={styles.infoText}>
              {texts.validator.rioxInfo}
            </Markdown>
          </Message>
          <div className={styles.validationField}>
            <div className={styles.tabWrapper}>
              <Button
                className={classNames.use(styles.tab, {
                  [styles.activeTab]: activeTab === TABS.myRepository,
                })}
                onClick={() => handleTabChange(TABS.myRepository)}
              >
                {texts.validator.validator.actions[0].name}
              </Button>
              <Button
                className={classNames.use(styles.tab, {
                  [styles.activeTab]: activeTab === TABS.validation,
                })}
                onClick={() => handleTabChange(TABS.validation)}
              >
                {texts.validator.validator.actions[1].name}
              </Button>
            </div>
            {activeTab === TABS.myRepository && (
              <MyRepository
                // filterRepositoryData={filterRepositoryIssueData}
                filterRepositoryIssueData
                // repositoryData={repositoryData}
              />
            )}
            {activeTab === TABS.validation && (
              <RioxValidator
                handleValidateClick={handleValidateClick}
                validationResult={validationResult}
                handleTextareaChange={handleTextareaChange}
                recordValue={recordValue}
                filteredIssue={filteredIssue}
                filteredWarning={filteredWarning}
              />
            )}
          </div>
        </>
      ) : (
        <NotEnoughDataMessage />
      )}
    </Tag>
  )
}

export default ValidatorPageTemplate
