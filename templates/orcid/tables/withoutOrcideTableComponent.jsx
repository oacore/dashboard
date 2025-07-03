import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useRef, useState } from 'react'

import styles from '../styles.module.css'
import { Button, ProgressSpinner } from '../../../design'
import Tablev2 from '../../../components/tablev2/tablev2'
import TableArticle from '../../../components/dropdownTableCard/article'
import Table from '../../../components/table'
import idIcon from '../../../components/upload/assets/id.svg'
import kababMenu from '../../../components/upload/assets/kebabMenu.svg'
import Menu from '../../../components/menu'
import texts from '../../../texts/orcid'
import { GlobalContext } from '../../../store'
import { formatNumber } from '../../../utils/helpers'

// TODO remove if not needed
const WithoutOrcideTableComponent = observer(
  ({
    initialLoad,
    data,
    onSetActiveArticle,
    isLoading,
    renderDropDown,
    changeArticleVisibility,
    articleData,
    loading,
    outputsUrl,
    setVisibleMenu,
    visibleMenu,
    articleAdditionalDataLoading,
    handleToggleRedirect,
    totalLength,
  }) => {
    const { ...globalStore } = useContext(GlobalContext)
    const menuRef = useRef(null)
    const [localSearchTerm, setLocalSearchTerm] = useState('')
    const [page, setPage] = useState(0)
    const [selectedRowData, setSelectedRowData] = useState(null)

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

    const onSearchChange = async (event) => {
      const searchTerm = event.target.value
      setLocalSearchTerm(searchTerm)
      await globalStore.dataProvider.getOrcidWithoutPaperData(
        globalStore?.dataProvider?.id,
        searchTerm,
        0,
        50
      )
    }

    const handleClick = (e, rowDetail) => {
      e.preventDefault()
      e.stopPropagation()
      setSelectedRowData(rowDetail)
      setVisibleMenu(!visibleMenu)
    }

    const fetchData = async () => {
      if (
        globalStore.dataProvider.withoutOrcidTableDataLoading ||
        data?.length === totalLength
      )
        return

      const from = (page + 1) * 50
      const size = 50

      try {
        await globalStore.dataProvider.getOrcidWithoutPaperData(
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

    return (
      <div id="withoutOrcideTable">
        {initialLoad ? (
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
            data={data}
            size={data?.length}
            totalLength={formatNumber(totalLength)}
            localSearch
            searchable
            searchChange={onSearchChange}
            localSearchTerm={localSearchTerm}
            rowClick={(row) => onSetActiveArticle(row)}
            fetchData={fetchData}
            // excludeFooter={checkBillingType || !hasData || hasError}
            isLoading={isLoading}
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
          </Tablev2>
        )}
      </div>
    )
  }
)

export default WithoutOrcideTableComponent
