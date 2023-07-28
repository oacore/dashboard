import React, { useState, useEffect } from 'react'
import { Button, Icon } from '@oacore/design/lib/elements'
import { observer } from 'mobx-react-lite'

import styles from '../styles.module.css'
import texts from '../../../texts/deduplication/deduplication.yml'
import Table from '../../../components/table'
import kababMenu from '../../../components/upload/assets/kebabMenu.svg'
import Menu from '../../../components/menu'
import Actions from '../../../components/actions'
import CompareWarning from '../cards/warningCard'
import ComparisonTable from './comparisonTable'

const InnerTable = observer(
  ({
    combinedArray,
    handleButtonToggle,
    compare,
    updateWork,
    getOutputsData,
    worksDataInfo,
    outputData,
    getDeduplicationInfo,
  }) => {
    const [visibleMenu, setVisibleMenu] = useState(false)
    const [selectedRowData, setSelectedRowData] = useState(null)
    const [visibleWarning, setVisibleWarning] = useState(
      localStorage.getItem('visibleWarning') === 'true'
    )

    useEffect(() => {
      localStorage.setItem('visibleWarning', visibleWarning)
    }, [visibleWarning])

    const handleClick = (e, rowDetail) => {
      e.preventDefault()
      e.stopPropagation()
      setSelectedRowData(rowDetail)
      setVisibleMenu(!visibleMenu)
    }

    const handleRedirect = (e, id) => {
      e.preventDefault()
      e.stopPropagation()
      window.open(`https://core.ac.uk/outputs/${id}`, '_blank')
    }

    const handleToggleRedirect = (e, key, outputsId, oaiId) => {
      e.preventDefault()
      e.stopPropagation()
      setVisibleMenu(false)
      if (key === 'coreUrl')
        window.open(`https://core.ac.uk/outputs/${outputsId}`, '_blank')
      else window.open(`${process.env.IDP_URL}/oai/${oaiId}`, '_blank')
    }

    const getBackgroundColor = (type) => {
      if (type === 'duplicate') return styles.duplicate
      if (type === 'notSameArticle') return styles.notSameArticle
      return styles.other
    }

    useEffect(() => {
      handleButtonToggle()
    }, [])

    return (
      <>
        <div className={styles.contentWrapper}>
          <CompareWarning
            title={texts.moreInfo.tableTitle}
            show={texts.moreInfo.show}
            hide={texts.moreInfo.hide}
            description={texts.moreInfo.description}
            setText={setVisibleWarning}
            activeText={visibleWarning}
          />
          <Table
            className={styles.issueTable}
            fetchData={() => {}}
            hidePagination
            data={combinedArray}
            isHeaderClickable
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
              getter={(v) => v?.authors.map((author) => author).join(' ')}
            />
            <Table.Column
              id="count"
              display={
                <div className={styles.columnHeaderWrapper}>
                  <span>Status</span>
                  <Actions
                    questionMark
                    description={texts.moreInfo.duplicates}
                  />
                </div>
              }
              getter={(v) =>
                v?.type ? (
                  <span
                    className={` ${
                      styles.duplicateCellInner
                    } ${getBackgroundColor(v?.type)}`}
                  >
                    {v?.type}
                  </span>
                ) : (
                  <div className={styles.default}>Need to be reviewed</div>
                )
              }
              className={styles.duplicateColumn}
            />
            <Table.Column
              id="publicationDate"
              display={
                <div className={styles.columnHeaderWrapper}>
                  <span>Publication date</span>
                  <Actions
                    questionMark
                    description={texts.moreInfo.publicationDate}
                  />
                </div>
              }
              className={styles.publicationDateColumn}
              getter={(v) => v?.publicationDate}
            />
            <Table.Column
              id="visibility"
              getter={(v) => (
                <Icon
                  src="#eye"
                  onClick={(e) => handleRedirect(e, v.documentId)}
                  className={styles.visibilityIcon}
                />
              )}
              className={styles.visibilityStatusColumn}
            />
            <Table.Column
              id="output"
              getter={(v) => (
                <div className={styles.actionButtonWrapper}>
                  <Button
                    className={styles.actionButtonPure}
                    onClick={(e) => handleClick(e, v)}
                  >
                    <img src={kababMenu} alt="kababMenu" />
                  </Button>
                  <Menu
                    visible={visibleMenu && selectedRowData === v}
                    className={styles.menuButton}
                    stopPropagation
                  >
                    {Object.values(texts.actions).map(({ title, key }) => (
                      <Menu.Item key={key}>
                        {/* eslint-disable-next-line max-len */}
                        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
                        <div
                          onClick={(e) =>
                            handleToggleRedirect(e, key, v.documentId, v.oai)
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
          </Table>
          <ComparisonTable
            updateWork={updateWork}
            getDeduplicationInfo={getDeduplicationInfo}
            getOutputsData={getOutputsData}
            outputData={outputData}
            combinedArray={combinedArray}
            worksDataInfo={worksDataInfo}
            handleButtonToggle={handleButtonToggle}
            compare={compare}
          />
        </div>
      </>
    )
  }
)

export default InnerTable
