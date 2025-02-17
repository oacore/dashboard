import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { classNames } from '@oacore/design/lib/utils'
import * as MobX from 'mobx'

import styles from '../styles.module.css'

import { PaymentRequiredError } from 'store/errors'
import { Card, Icon } from 'design'
import DocumentLink from 'components/document-link'
import Table from 'components/table'
import ExportButton from 'components/export-button'
import { PaymentRequiredNote } from 'modules/billing'
import * as texts from 'texts/depositing'
import { formatDate } from 'utils/helpers'
import useDynamicTableData from 'components/table/hooks/use-dynamic-data'

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
    const { publicationDate: date, publicationDateMatchingLevel: status } =
      this.props.context

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

const DepositDatesTable = observer(
  ({ className, datesUrl, publicReleaseDatesPages: pages }) => {
    const [tableProps, fetchData, changeDataState] = useDynamicTableData({
      pages,
      defaultSize: 100,
    })

    useEffect(() => {
      const disposer = MobX.reaction(
        () => ({
          data: MobX.toJS(pages.data),
          isLastPageLoaded: pages.isLastPageLoaded,
          totalLength: pages.totalLength,
        }),
        (current) => {
          if (current.data) {
            changeDataState({
              type: 'CHANGE_DATA_STATE',
              value: {
                data: current.data,
                size: tableProps.size,
                isLastPageLoaded: current.isLastPageLoaded,
                totalLength: current.totalLength,
              },
            })
          }
        },
        { fireImmediately: true }
      )

      return () => disposer()
    }, [pages])

    const hasData = pages.data && pages.data.length > 0
    const hasError = !!pages.error

    return (
      <Table
        className={classNames.use(styles.browseTable).join(className)}
        fetchData={fetchData}
        excludeFooter={!hasData || hasError}
        searchable={!hasError}
        {...tableProps}
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
        {!hasError && (
          <Table.Sidebar>
            <SidebarContent />
          </Table.Sidebar>
        )}
        <Table.Action>
          <ExportButton href={datesUrl}>
            {texts.exporting.download}
          </ExportButton>
        </Table.Action>
      </Table>
    )
  }
)

const TableCard = observer(({ datesUrl, publicReleaseDatesPages: pages }) => {
  const hasData = pages?.data && pages.data.length > 0
  const error = pages?.error

  return (
    <Card
      id="deposit-dates-card"
      className={styles.browseTableCard}
      tag="section"
    >
      <Card.Title tag="h2">Deposit dates</Card.Title>
      <Card.Description>
        Lists deposit dates discovered from your repository
      </Card.Description>
      <DepositDatesTable
        className={error instanceof PaymentRequiredError && styles.muted}
        publicReleaseDatesPages={pages}
        datesUrl={datesUrl}
      />
      {error instanceof PaymentRequiredError && (
        <Card.Footer className={classNames.use(hasData && styles.backdrop)}>
          <PaymentRequiredNote template={texts.paymentRequired} />
        </Card.Footer>
      )}
    </Card>
  )
})

export default TableCard
