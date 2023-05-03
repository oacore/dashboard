import React from 'react'
import { Icon } from '@oacore/design/lib/elements'
import { classNames } from '@oacore/design/lib/utils'

import { Message } from '../../../design'
import styles from '../styles.module.css'
import info from '../../../components/upload/assets/info.svg'
import Markdown from '../../../components/markdown'
import texts from '../../../texts/deduplication'
import Table from '../../../components/table'
import { formatDate } from '../../../utils/helpers'

const InnerTable = ({ combinedArray }) => (
  <>
    <Message className={styles.dataErrorWrapper}>
      <img className={styles.infoIcon} src={info} alt="description" />
      <Markdown className={styles.infoText}>
        {/* eslint-disable-next-line import/no-named-as-default-member */}
        {texts.deduplication.moreInfo.description}
      </Markdown>
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
          // getter={(v) => (v.udpatedDate ? formatDate(udpatedDate) : '-')}
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
  </>
)

export default InnerTable
