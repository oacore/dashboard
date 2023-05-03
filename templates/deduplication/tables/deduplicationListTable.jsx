import React from 'react'
import { Icon } from '@oacore/design/lib/elements'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../styles.module.css'
import { Card } from '../../../design'
import Actions from '../../../components/actions'
import Table from '../../../components/table'
import { formatDate } from '../../../utils/helpers'

const DeduplicationListTable = ({ handeAdditionalInfo, list }) => (
  <>
    <div className={styles.headerWrapper}>
      <Card.Title tag="h2">List of duplicates</Card.Title>
      <Actions downloadUrl description="temp" />
    </div>
    <Table
      rowClick={handeAdditionalInfo}
      className={styles.issueTable}
      // fetchData={() => console.log('hi')}
      data={list}
      isHeaderClickable
      bla
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
        getter={(v) => v?.count || '-'}
        className={styles.duplicateColumn}
        cellClassName={styles.duplicateCell}
      />
      <Table.Column
        id="publicationDate"
        display="Publication date"
        className={styles.publicationDateColumn}
        getter={(v) => formatDate(v?.publicationDate)}
      />
      <Table.Column
        id="updateDate"
        display="Update date"
        className={styles.updateDateColumn}
        cellClassName={styles.dateCell}
        getter="-"
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
  </>
)

export default DeduplicationListTable
