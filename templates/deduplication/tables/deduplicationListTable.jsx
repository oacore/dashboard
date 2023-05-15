import React, { useEffect, useState } from 'react'
import { Icon } from '@oacore/design/lib/elements'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../styles.module.css'
import { Card } from '../../../design'
import Actions from '../../../components/actions'
import Table from '../../../components/table'

const DeduplicationListTable = ({ handeAdditionalInfo, list }) => {
  const [page, setPage] = useState(0)
  const [records, setRecords] = useState([])
  const handleVisibility = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  const handleClick = (e) => {
    handleVisibility(e)
  }

  useEffect(() => {
    const newRecords = [...records, ...list.slice(page * 10, (page + 1) * 10)]
    setRecords(newRecords)
  }, [page, list])

  return (
    <>
      <div className={styles.headerWrapper}>
        <Card.Title tag="h2">List of duplicates</Card.Title>
        <Actions downloadUrl description="temp" />
      </div>

      <Table
        rowClick={(row) => handeAdditionalInfo(row)}
        className={styles.issueTable}
        fetchData={() => setPage(page + 1)}
        data={records}
        totalLength={list.length}
        size={records.length}
        isHeaderClickable
      >
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
          getter={(v) => `+ ${v.count} found` || '-'}
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
              onClick={(e) => handleClick(e)}
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
    </>
  )
}

export default DeduplicationListTable
