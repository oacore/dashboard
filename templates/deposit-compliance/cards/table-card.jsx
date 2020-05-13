import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../styles.module.css'

import { formatDate } from 'utils/helpers'
import { Card, Icon } from 'design'
import Table from 'components/table'
import ExportButton from 'components/export-button'
import * as texts from 'texts/depositing'
import DocumentLink from 'components/document-link'

const SidebarContent = ({ context: { oai, originalId, authors, title } }) => {
  const { Header, Body, Footer } = Table.Sidebar

  return (
    <>
      <Header className={styles.header}>{oai}</Header>
      <Body>
        <p>
          <b>{title}</b>
        </p>
        <p>{authors?.map((a) => a.name).join(' ')}</p>
      </Body>
      <Footer>
        <DocumentLink href={`https://core.ac.uk/display/${originalId}`}>
          Open
        </DocumentLink>
      </Footer>
    </>
  )
}

const statusToCaption = (status) => {
  switch (status) {
    case 'full':
      return 'Matches Crossref'
    case 'partial':
      return 'Matches Crossref partially'
    case 'none':
      return 'Does not match Crossref'
    default:
      return null
  }
}

const MatchingIcon = ({ status }) => {
  const iconType = status === 'full' ? 'check' : 'alert'
  return (
    <Icon
      className={classNames.use(styles.matchingIcon, styles[status])}
      src={`#${iconType}-circle`}
      alt={statusToCaption(status)}
      aria-hidden
    />
  )
}

class PublicationDateColumn extends Table.Column {
  render() {
    const {
      publicReleaseDate: date,
      publicationDateMatchingLevel: status,
    } = this.props.context

    const showStatus = status && status !== 'full'
    const caption = showStatus !== 'full' && statusToCaption(status)

    return (
      <span title={caption}>
        {formatDate(date)}
        {showStatus && <MatchingIcon status={status} />}
      </span>
    )
  }
}

const TableCard = ({ isExportDisabled, datesUrl, publicReleaseDatesPages }) => (
  <Card
    id="deposit-dates-card"
    className={styles.browseTableCard}
    tag="section"
  >
    <Card.Title tag="h2">Browse deposit dates</Card.Title>
    <Table
      pages={publicReleaseDatesPages}
      className={styles.browseTable}
      defaultSize={15}
      searchable
    >
      <Table.Column
        id="oai"
        display="OAI"
        order="any"
        getter={(v) => v.oai.split(':').pop()}
        className={styles.oaiColumn}
      />
      <Table.Column
        id="title"
        display="Title"
        order="any"
        className={styles.titleColumn}
      />
      <Table.Column
        id="authors"
        display="Authors"
        order="any"
        className={styles.authorsColumn}
        getter={(v) => v.authors && v.authors.map((a) => a.name).join(' ')}
      />
      <PublicationDateColumn
        id="publicationDate"
        display="Publication date"
        order="any"
        className={styles.depositDateColumn}
      />
      <Table.Column
        id="publicReleaseDate"
        display="Deposit date"
        order="desc"
        className={styles.depositDateColumn}
        getter={(v) => formatDate(v.publicReleaseDate)}
      />
      <Table.Sidebar>
        <SidebarContent />
      </Table.Sidebar>
      <Table.Action>
        <ExportButton href={datesUrl} disabled={isExportDisabled}>
          {texts.exporting.download}
        </ExportButton>
      </Table.Action>
    </Table>
  </Card>
)

export default TableCard
