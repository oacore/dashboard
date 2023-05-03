import React from 'react'
import { Icon } from '@oacore/design/lib/elements'
import { classNames } from '@oacore/design/lib/utils'

import { Message } from '../../../design'
import styles from '../styles.module.css'
import { deduplication } from '../../../texts/deduplication'
import Markdown from '../../../components/markdown'
import Table from '../../../components/table'
import { formatDate } from '../../../utils/helpers'

const ComparisonTable = ({ combinedArray }) => (
  <>
    <Message className={styles.dataComparisonWrapper}>
      <div className={styles.dataComparisonHeader}>
        <h3 className={styles.dataComparisonHeaderTitle}>
          {/* text */}
          {deduplication.deduplication.moreInfoComparison.title}
        </h3>
        <Markdown className={styles.dataComparisonHeaderText}>
          {/* text */}
          {deduplication.deduplication.moreInfoComparison.description}
        </Markdown>
      </div>
      <div className={styles.optionItems}>
        {Object.values(
          // texts.deduplication.moreInfoComparison?.options || []
          deduplication.deduplication.moreInfoComparison?.options || []
        ).map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className={styles.optionItem} key={index}>
            <div className={styles.optionTitle}>{item.title}</div>-
            <div className={styles.optionDescription}>{item.description}</div>
          </div>
        ))}
      </div>
    </Message>
    <div>
      <Table
        // rowClick={handeAdditionalInfo}
        className={styles.issueTable}
        // fetchData={() => console.log('hi')}
        data={combinedArray}
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
          getter={(v) => v?.type || '-'}
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
    </div>
    {/* <TableActions /> */}
  </>
)

export default ComparisonTable
