import React from 'react'

import styles from '../styles.module.css'

import Table from 'components/table'
import { formatDate } from 'utils/helpers'

const IssuesList = ({ issuesList, fetchData }) => {
  const tableProps = {
    ...issuesList,
    buttonVariant: 'contained',
    buttonText: 'Load more',
  }
  return (
    <div className={styles.issueTable}>
      <Table fetchData={fetchData} {...tableProps}>
        <Table.Column
          id="oai"
          display="OAI"
          getter={(v) => {
            const { oai } = v?.output
            if (oai) return oai.split(':').pop()
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
          getter={(v) => {
            const { udpatedDate } = v?.output
            return udpatedDate ? formatDate(udpatedDate) : '-'
          }}
        />
        {/* <Table.Sidebar>
          <SidebarContent changeVisibility={changeVisibility} />
        </Table.Sidebar> */}
        {/* <Table.Action>
          <ExportButton href={exportUrl}>{texts.exporting.download}
          </ExportButton>
        </Table.Action> */}
      </Table>
    </div>
  )
}

export default IssuesList
