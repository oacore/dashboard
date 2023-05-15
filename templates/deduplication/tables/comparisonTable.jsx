import React, { useState, useEffect } from 'react'
import { Icon } from '@oacore/design/lib/elements'
import { classNames } from '@oacore/design/lib/utils'

import { Message } from '../../../design'
import styles from '../styles.module.css'
import texts from '../../../texts/deduplication/deduplication.yml'
import Markdown from '../../../components/markdown'
import Table from '../../../components/table'
import TableActions from '../cards/tableActions'
import CompareCard from '../cards/compareCard'

const ComparisonTable = ({
  combinedArray,
  updateWork,
  outputsData,
  worksDataInfo,
}) => {
  const [selectedRow, setSelectedRow] = useState(combinedArray[0])
  const [outputsDataInfo, setOutputsDataInfo] = useState(null)

  const handleOutputsData = (selectedRowData) => {
    setSelectedRow(selectedRowData)
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await outputsData(selectedRow.documentId)
      setOutputsDataInfo(data)
    }
    fetchData()
  }, [selectedRow.documentId])

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
              if (v?.oai) return v.oai.split(':').pop()
              return '-'
            }}
            className={styles.oaiColumn}
            cellClassName={styles.oaiCell}
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
            getter={(v) => v?.type || '-'}
            className={styles.duplicateColumn}
            cellClassName={styles.duplicateCell}
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
                src={v?.disabled ? '#eye-off' : '#eye'}
                className={classNames.use(styles.visibilityIcon, {
                  [styles.visibilityIconDark]: v?.disabled,
                })}
              />
            )}
            className={styles.visibilityStatusColumn}
          />
          <Table.Details id="output" />
        </Table>
      </div>
      <CompareCard
        worksDataInfo={worksDataInfo}
        outputsDataInfo={outputsDataInfo}
      />
      <TableActions
        selectedRowData={selectedRow}
        updateWork={updateWork}
        worksDataInfo={worksDataInfo}
        outputsDataInfo={outputsDataInfo}
      />
    </>
  )
}

export default ComparisonTable
