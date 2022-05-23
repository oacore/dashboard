import React from 'react'
import { Icon } from '@oacore/design/lib/elements'

import styles from './table.module.css'
import Article from './article'

import Table from 'components/table'
import { formatDate } from 'utils/helpers'

const ArticlesList = ({
  issuesList,
  fetchData,
  onSetActiveArticle,
  activeArticle,
}) => {
  const tableProps = {
    ...issuesList,
    buttonVariant: 'contained',
    buttonText: 'Load more',
  }

  return (
    <div className={styles.issueTable}>
      <Table
        fetchData={fetchData}
        isHeaderClickable={false}
        useExpandIcon
        defaultRowClick={onSetActiveArticle}
        {...tableProps}
      >
        <Table.Column
          id="oai"
          display="OAI"
          getter={(v) => {
            if (v?.output.oai) return v.output.oai.split(':').pop()
            return '-'
          }}
          className={styles.oaiColumn}
          cellClassName={styles.oaiCell}
        />
        <Table.Column
          id="title"
          display="Title"
          getter={(v) => {
            const { title } = v?.output
            return title || '-'
          }}
          className={styles.titleColumn}
        />
        <Table.Column
          id="authors"
          display="Authors"
          className={styles.authorsColumn}
          getter={(v) => v?.output.authors.join(' ')}
        />
        <Table.Column
          id="publicationDate"
          display="Publication date"
          className={styles.publicationDateColumn}
          getter={(v) => formatDate(v?.output.datePublished)}
        />
        <Table.Column
          id="updateDate"
          display="Update date"
          className={styles.updateDateColumn}
          cellClassName={styles.dateCell}
          getter={(v) => {
            const { udpatedDate } = v?.output
            return udpatedDate ? formatDate(udpatedDate) : '-'
          }}
        />
        <Table.Column
          id="visibility"
          getter={() => <Icon src="#eye" className={styles.visibilityIcon} />}
          className={styles.visibilityStatusColumn}
        />

        <Table.Details id="output">
          <Article article={activeArticle} />
        </Table.Details>
      </Table>
    </div>
  )
}

export default ArticlesList
