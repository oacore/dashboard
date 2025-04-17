import React, { useContext, useEffect, useState } from 'react'
import { Card } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import { Button } from '../../../design'
import styles from '../styles.module.css'
import { GlobalContext } from '../../../store'
import request from '../../../api'
import OrcideTableComponent from './tableComponent'
import OtherOrcideTableComponent from './otherOrcidtableComponent'
import WithoutOrcideTableComponent from './withoutOrcideTableComponent'

import texts from 'texts/orcid'

const OrcidTable = ({
  tableOrcidData,
  articleAdditionalDataLoading,
  orcidTableDataLoading,
  renderDropDown,
  articleData,
  tableOrcidWithoutPaperData,
  tableOrcidOtherData,
  withoutOrcidTableDataLoading,
  orcidOtherTableDataLoading,
  setActiveButton,
  activeButton,
  // className,
  initialLoad,
}) => {
  const { ...globalStore } = useContext(GlobalContext)
  const [visibleMenu, setVisibleMenu] = useState(false)

  const [outputsUrl, setOutputsUrl] = useState()
  const [loading, setLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const [currentTab, setCurrentTab] = useState(activeButton)

  useEffect(() => {
    setCurrentTab(activeButton)
  }, [activeButton])

  const handleButtonClick = (action) => {
    setActiveButton(action)
  }

  const handleToggleRedirect = (e, key, outputsId, oaiId) => {
    e.preventDefault()
    e.stopPropagation()
    setVisibleMenu(false)
    if (key === 'coreUrl')
      window.open(`https://core.ac.uk/outputs/${outputsId}`, '_blank')
    else window.open(`${process.env.IDP_URL}/oai/${oaiId}`, '_blank')
  }

  const onSetActiveArticle = async (row) => {
    await globalStore.dataProvider.getOutputsAdditionalData(row.coreId)
    setOutputsUrl(`https://core.ac.uk/outputs/${row.coreId}`)
  }

  const changeArticleVisibility = async (article) => {
    setLoading(true)
    try {
      await request(`/articles/${article.id}`, {
        method: 'PATCH',
        body: { disabled: !article?.disabled },
      })
      setIsDisabled(!isDisabled)
      Object.assign(globalStore.dataProvider.articleAdditionalData, {
        disabled: !globalStore.dataProvider.articleAdditionalData?.disabled,
      })
    } catch (error) {
      throw Error(error)
    } finally {
      setLoading(false)
    }
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'with':
        return (
          <OrcideTableComponent
            initialLoad={initialLoad}
            data={tableOrcidData}
            onSetActiveArticle={onSetActiveArticle}
            isLoading={orcidTableDataLoading}
            renderDropDown={renderDropDown}
            changeArticleVisibility={changeArticleVisibility}
            articleData={articleData}
            loading={loading}
            outputsUrl={outputsUrl}
            articleAdditionalDataLoading={articleAdditionalDataLoading}
            visibleMenu={visibleMenu}
            setVisibleMenu={setVisibleMenu}
            handleToggleRedirect={handleToggleRedirect}
            totalLength={globalStore.dataProvider.orcidStatData.basic}
          />
        )
      case 'without':
        return (
          <WithoutOrcideTableComponent
            initialLoad={initialLoad}
            data={tableOrcidWithoutPaperData}
            onSetActiveArticle={onSetActiveArticle}
            isLoading={withoutOrcidTableDataLoading}
            renderDropDown={renderDropDown}
            changeArticleVisibility={changeArticleVisibility}
            articleData={articleData}
            loading={loading}
            outputsUrl={outputsUrl}
            articleAdditionalDataLoading={articleAdditionalDataLoading}
            visibleMenu={visibleMenu}
            setVisibleMenu={setVisibleMenu}
            handleToggleRedirect={handleToggleRedirect}
            totalLength={
              globalStore.dataProvider?.statistics?.countMetadata -
              globalStore.dataProvider.orcidStatData.basic
            }
          />
        )
      case 'other':
        return (
          <OtherOrcideTableComponent
            initialLoad={initialLoad}
            data={tableOrcidOtherData}
            onSetActiveArticle={onSetActiveArticle}
            isLoading={orcidOtherTableDataLoading}
            renderDropDown={renderDropDown}
            changeArticleVisibility={changeArticleVisibility}
            articleData={articleData}
            loading={loading}
            outputsUrl={outputsUrl}
            articleAdditionalDataLoading={articleAdditionalDataLoading}
            visibleMenu={visibleMenu}
            setVisibleMenu={setVisibleMenu}
            handleToggleRedirect={handleToggleRedirect}
            totalLength={
              globalStore.dataProvider.orcidStatData.fromOtherRepositories
            }
          />
        )
      default:
        return null
    }
  }

  return (
    <Card className={styles.orcidTableWrapper}>
      <div className={styles.buttonGroup}>
        {Object.values(texts.table.actions).map((button) => (
          <Button
            key={button.action}
            className={classNames.use(styles.actionButton, {
              [styles.activeButton]: activeButton === button.action,
            })}
            onClick={() => handleButtonClick(button.action)}
          >
            {button.name}
          </Button>
        ))}
      </div>
      <div className={styles.contentWrapper}>{renderContent()}</div>
    </Card>
  )
}

export default OrcidTable
