import React, { useContext, useEffect, useRef, useState } from 'react'
import { Card } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import { ProgressSpinner, Button } from '../../../design'
import styles from '../styles.module.css'
import Tablev2 from '../../../components/tablev2/tablev2'
import { GlobalContext } from '../../../store'
// import ExportButton from '../../../components/export-button'
import kababMenu from '../../../components/upload/assets/kebabMenu.svg'
import Menu from '../../../components/menu'
import TableArticle from '../../../components/dropdownTableCard/article'
import request from '../../../api'
import ExportButton from '../../../components/export-button'

import idIcon from 'components/upload/assets/id.svg'
import Table from 'components/table'
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
  const menuRef = useRef(null)

  const [localSearchTerm, setLocalSearchTerm] = useState('')
  const [visibleMenu, setVisibleMenu] = useState(false)
  const [selectedRowData, setSelectedRowData] = useState(null)
  const [outputsUrl, setOutputsUrl] = useState()
  const [loading, setLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const [page, setPage] = useState(0)

  const handleButtonClick = (action) => {
    setActiveButton(action)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target))
        setVisibleMenu(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuRef])

  const handleClick = (e, rowDetail) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedRowData(rowDetail)
    setVisibleMenu(!visibleMenu)
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
    await globalStore.dataProvider.getOutputsAdditionalData(row.id)
    setOutputsUrl(`https://core.ac.uk/outputs/${row.id}`)
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

  const onSearchChange = async (event) => {
    const searchTerm = event.target.value
    setLocalSearchTerm(searchTerm)
    await globalStore.dataProvider.getOrcidData(
      globalStore?.dataProvider?.id,
      searchTerm,
      0,
      50
    )
  }

  const fetchData = async () => {
    //  UPDATE NEEDED WHEN WE GET COUNT
    if (
      globalStore.dataProvider.orcidTableDataLoading ||
      tableOrcidDatas?.length === tableOrcidDatas
    )
      return

    const from = (page + 1) * 50
    const size = 50

    try {
      await globalStore.dataProvider.getOrcidData(
        globalStore.dataProvider.id,
        localSearchTerm,
        from,
        size
      )
      setPage((prevPage) => prevPage + 1)
    } catch (error) {
      console.error('Error fetching additional data:', error)
    }
  }

  const renderContent = () => {
    switch (activeButton) {
      case 'with':
        return initialLoad ? (
          <div className={styles.dataSpinnerWrapper}>
            <ProgressSpinner className={styles.spinner} />
            <p className={styles.spinnerText}>
              This may take a while, longer for larger repositories ...
            </p>
          </div>
        ) : (
          <Tablev2
            className={styles.orcidTable}
            isHeaderClickable
            rowIdentifier="articleId"
            data={tableOrcidDatas}
            size={tableOrcidDatas?.length}
            // totalLength={formatNumber(totalCount)}
            localSearch
            searchable
            searchChange={onSearchChange}
            localSearchTerm={localSearchTerm}
            rowClick={(row) => onSetActiveArticle(row)}
            fetchData={fetchData}
            // excludeFooter={checkBillingType || !hasData || hasError}
            isLoading={orcidTableDataLoading}
            renderDropDown={renderDropDown}
            details={
              <TableArticle
                changeVisibility={changeArticleVisibility}
                article={articleData}
                loading={loading}
                outputsUrl={outputsUrl}
                articleAdditionalDataLoading={articleAdditionalDataLoading}
              />
            }
          >
            <Table.Column
              id="oai"
              display="OAI"
              getter={(v) => {
                if (v?.oai) {
                  return (
                    <span className={styles.oaiCell}>
                      {v.oai.split(':').pop()}
                    </span>
                  )
                }
                return '-'
              }}
              className={styles.oaiColumn}
            />
            <Table.Column
              id="title"
              display="Title"
              getter={(v) => v?.title || '-'}
              className={styles.titleColumn}
            />
            <Table.Column
              id="authors"
              display="Authors"
              className={styles.authorsColumn}
              getter={(v) =>
                v.authors && v.authors.map((a) => a.name).join(' ')
              }
            />
            <Table.Column
              id="orcid"
              display="ORCID ID"
              getter={(v) => {
                if (v?.author_pid) {
                  return (
                    <span className={styles.orcidCell}>
                      <img src={idIcon} alt="idIcon" />
                      {v?.author_pid || '-'}
                    </span>
                  )
                }
                return '-'
              }}
              className={styles.orcidColumn}
            />
            <Table.Column
              id="publicationDate"
              display="Publication date"
              className={styles.publicationDateColumn}
              getter={(v) => v?.publicationDate}
            />
            <Table.Column
              id="actions"
              getter={(v) => (
                <div className={styles.actionButtonWrapper}>
                  <Button
                    className={styles.actionButtonPure}
                    onClick={(e) => handleClick(e, v)}
                  >
                    <img src={kababMenu} alt="kababMenu" />
                  </Button>
                  <Menu
                    ref={menuRef}
                    visible={visibleMenu && selectedRowData === v}
                    className={styles.menuButton}
                    stopPropagation
                  >
                    {Object.values(texts.actions).map(({ title, key }) => (
                      <Menu.Item key={key} target="_blank">
                        {/* eslint-disable-next-line max-len */}
                        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                        <div
                          onClick={(e) =>
                            handleToggleRedirect(e, key, v.id, v.oai)
                          }
                          className={styles.togglerTitle}
                        >
                          {title}
                        </div>
                      </Menu.Item>
                    ))}
                  </Menu>
                </div>
              )}
            />
            <Table.Action>
              <ExportButton href={globalStore.dataProvider.basicOrcidUrl}>
                download csv
              </ExportButton>
            </Table.Action>
          </Tablev2>
        )
      case 'without':
        return <p>SALIAMIIII</p>
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
