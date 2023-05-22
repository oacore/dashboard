import React, { useState, useEffect } from 'react'
import { Button, Icon } from '@oacore/design/lib/elements'
import { observer } from 'mobx-react-lite'

import { Message } from '../../../design'
import styles from '../styles.module.css'
import texts from '../../../texts/deduplication/deduplication.yml'
import Markdown from '../../../components/markdown'
import Table from '../../../components/table'
import TableActions from '../cards/tableActions'
import CompareCard from '../cards/compareCard'
import kababMenu from '../../../components/upload/assets/kebabMenu.svg'
import Menu from '../../../components/menu'

const ComparisonTable = observer(
  ({
    combinedArray,
    updateWork,
    getOutputsData,
    worksDataInfo,
    outputData,
    getDeduplicationInfo,
  }) => {
    const [selectedRow, setSelectedRow] = useState(combinedArray[0])
    const [visibleMenu, setVisibleMenu] = useState(false)
    const [selectedData, setSelectedData] = useState(null)

    const handleClick = (e, rowDetail) => {
      e.preventDefault()
      e.stopPropagation()
      setSelectedData(rowDetail)
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
      else window.open(`https://api.core.ac.uk/oai/${oaiId}`, '_blank')
    }

    const handleOutputsData = (selectedRowData) => {
      setSelectedRow(selectedRowData)
    }

    useEffect(() => {
      const fetchData = async () => {
        await getOutputsData(selectedRow.documentId)
      }
      fetchData()
    }, [selectedRow.documentId])

    const getBackgroundColor = (type) => {
      if (type === 'duplicate') return styles.duplicate
      if (type === 'other') return styles.other
      if (type === 'notSameArticle') return styles.notSameArticle

      return styles.default
    }

    return (
      <>
        <Message className={styles.dataComparisonWrapper}>
          <div className={styles.dataComparisonHeader}>
            <h3 className={styles.dataComparisonHeaderTitle}>
              {texts.moreInfoComparison.title}
            </h3>
            <Markdown className={styles.dataComparisonHeaderText}>
              {texts.moreInfoComparison.description}
            </Markdown>
          </div>
          <div className={styles.optionItems}>
            {Object.values(texts.moreInfoComparison?.options || []).map(
              (item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <div className={styles.optionItem} key={index}>
                  <div className={styles.optionTitle}>{item.title}</div>-
                  <div className={styles.optionDescription}>
                    {item.description}
                  </div>
                </div>
              )
            )}
          </div>
        </Message>
        <div>
          <Table
            className={styles.issueTable}
            fetchData={() => {}}
            hidePagination
            data={combinedArray}
            isHeaderClickable
          >
            <Table.Column
              id="radio"
              display=""
              getter={(v) => (
                <input
                  type="radio"
                  name="selectedRow"
                  checked={selectedRow.documentId === v?.documentId}
                  onChange={() => handleOutputsData(v)}
                />
              )}
              cellClassName={styles.radioColumn}
            />
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
              display="Duplicates"
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
              display="Publication date"
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
                    visible={visibleMenu && selectedData === v}
                    className={styles.menuButton}
                    stopPropagation
                  >
                    {Object.values(texts.actions).map(({ title, key }) => (
                      <Menu.Item key={key}>
                        {/* eslint-disable-next-line max-len */}
                        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                        <div
                          onClick={(e) =>
                            handleToggleRedirect(e, key, v.documentId, v.oai)
                          }
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
        </div>
        <CompareCard
          worksDataInfo={worksDataInfo}
          outputsDataInfo={outputData}
        />
        <TableActions
          selectedRowData={selectedRow}
          updateWork={updateWork}
          getDeduplicationInfo={getDeduplicationInfo}
          worksDataInfo={worksDataInfo}
          outputsDataInfo={outputData}
        />
      </>
    )
  }
)

export default ComparisonTable
