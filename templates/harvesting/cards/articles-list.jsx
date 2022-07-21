import React from 'react'
import { Icon } from '@oacore/design/lib/elements'
import { classNames } from '@oacore/design/lib/utils'

import styles from './table.module.css'
import Article from './article'

import Table from 'components/table'
import { formatDate } from 'utils/helpers'

const ArticlesList = ({
  issuesList,
  fetchData,
  onSetActiveArticle,
  activeArticle,
  changeArticleVisibility,
  loading,
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
            if (v?.output?.oai) return v.output.oai.split(':').pop()
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
          getter={(v) =>
            v?.output.authors.map((author) => author.name).join(' ')
          }
        />
        <Table.Column
          id="publicationDate"
          display="Publication date"
          className={styles.publicationDateColumn}
          getter={(v) => formatDate(v?.output.publishedDate)}
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
          getter={(v) => (
            <Icon
              src={v.output?.disabled ? '#eye-off' : '#eye'}
              className={classNames.use(styles.visibilityIcon, {
                [styles.visibilityIconDark]: v.output?.disabled,
              })}
            />
          )}
          className={styles.visibilityStatusColumn}
        />

        <Table.Details id="output">
          <Article
            loading={loading}
            article={activeArticle}
            changeVisibility={changeArticleVisibility}
          />
        </Table.Details>
      </Table>
    </div>
  )
}

export default ArticlesList
