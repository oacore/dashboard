import React, { useContext, useState } from 'react'
import { Card } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import { Button } from '../../../design'
import styles from '../styles.module.css'
import { GlobalContext } from '../../../store'
import request from '../../../api'
import OrcideTableComponent from './tableComponent'

import texts from 'texts/orcid'

const OrcidTable = ({
  tableOrcidDatas,
  articleAdditionalDataLoading,
  orcidTableDataLoading,
  renderDropDown,
  articleData,
  // tableOrcidWithoutPaperData,
  // tableOrcidOtherData,
  // className,
  initialLoad,
}) => {
  const [activeButton, setActiveButton] = useState('with')
  const { ...globalStore } = useContext(GlobalContext)
  const [visibleMenu, setVisibleMenu] = useState(false)

  const [outputsUrl, setOutputsUrl] = useState()
  const [loading, setLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)

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
    switch (activeButton) {
      case 'with':
        return (
          <OrcideTableComponent
            initialLoad={initialLoad}
            data={tableOrcidDatas}
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
          />
        )
      case 'without':
        return (
          <OrcideTableComponent
            initialLoad={initialLoad}
            data={tableOrcidDatas}
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
          />
        )
      case 'other':
        return <span>ABAA BEHOO</span>
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
