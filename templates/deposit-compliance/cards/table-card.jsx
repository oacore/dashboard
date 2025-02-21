import React, { useContext, useEffect, useState } from 'react'
import { useObserver } from 'mobx-react-lite'
import { classNames } from '@oacore/design/lib/utils'

import { ProgressSpinner } from '../../../design'
import styles from '../styles.module.css'
import Tablev2 from '../../../components/tablev2/tablev2'
import { GlobalContext } from '../../../store'

import { PaymentRequiredError } from 'store/errors'
import { Card, Icon } from 'design'
import DocumentLink from 'components/document-link'
import Table from 'components/table'
import ExportButton from 'components/export-button'
import { PaymentRequiredNote } from 'modules/billing'
import * as texts from 'texts/depositing'
import { formatDate, formatNumber } from 'utils/helpers'

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

const DepositDatesTable = ({
  className,
  datesUrl,
  checkBillingType,
  publicReleaseDatesPages,
  totalCount,
  isPublicReleaseDatesInProgress,
  publicReleaseDatesError,
  sortConfig,
  setSortConfig,
}) => {
  const { ...globalStore } = useContext(GlobalContext)
  // eslint-disable-next-line max-len
  // const hasData = publicReleaseDatesPages && publicReleaseDatesPages.length > 0
  const hasError = !!publicReleaseDatesError

  const [page, setPage] = useState(0)
  const [localSearchTerm, setLocalSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    const fetchInitialData = async () => {
      setPage(0)
      await globalStore.dataProvider.depositDates.retrieveDepositDatesTable(
        0,
        100,
        `${sortConfig.field}:${sortConfig.direction}`,
        localSearchTerm
      )
      setInitialLoad(false)
    }
    fetchInitialData()
  }, [])

  const fetchData = async () => {
    if (
      loading ||
      globalStore.dataProvider.depositDates.isPublicReleaseDatesInProgress
    )
      return

    const from = (page + 1) * 100
    const size = 100

    try {
      setLoading(true)
      await globalStore.dataProvider.depositDates.retrieveDepositDatesTable(
        from,
        size,
        `${sortConfig.field}:${sortConfig.direction}`,
        localSearchTerm,
        {
          wait: true,
          refresh: true,
          fromDate: globalStore.dataProvider.depositDates.dateRange?.startDate,
          toDate: globalStore.dataProvider.depositDates.dateRange?.endDate,
        }
      )
      setPage((prevPage) => prevPage + 1)
    } catch (error) {
      console.error('Error fetching additional data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field) => {
    setSortConfig((prevConfig) => ({
      field,
      direction:
        prevConfig.field === field && prevConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    }))
    setPage(0)
    // Fetch initial data with new sort
    globalStore.dataProvider.depositDates.retrieveDepositDatesTable(
      0,
      100,
      `${field}:${
        sortConfig.field === field && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc'
      }`,
      localSearchTerm,
      {
        wait: true,
        refresh: true,
        fromDate: globalStore.dataProvider.depositDates.dateRange?.startDate,
        toDate: globalStore.dataProvider.depositDates.dateRange?.endDate,
      }
    )
  }

  const onSearchChange = async (event) => {
    const searchTerm = event.target.value
    setLocalSearchTerm(searchTerm)
    setPage(0)
    await globalStore.dataProvider.depositDates.retrieveDepositDatesTable(
      0,
      100,
      `${sortConfig.field}:${sortConfig.direction}`,
      searchTerm
    )
  }

  return initialLoad ? (
    <div className={styles.dataSpinnerWrapper}>
      <ProgressSpinner className={styles.spinner} />
      <p className={styles.spinnerText}>
        This may take a while, longer for larger repositories ...
      </p>
    </div>
  ) : (
    <Tablev2
      className={classNames.use(styles.browseTable).join(className)}
      isHeaderClickable
      rowIdentifier="articleId"
      data={
        checkBillingType
          ? publicReleaseDatesPages.slice(0, 5)
          : publicReleaseDatesPages
      }
      size={publicReleaseDatesPages?.length}
      totalLength={formatNumber(totalCount)}
      localSearch
      fetchData={fetchData}
      excludeFooter={checkBillingType}
      searchable
      // className={styles.sdgTable}
      // rowClick={(row) => onSetActiveArticle(row)}
      isLoading={isPublicReleaseDatesInProgress}
      localSearchTerm={localSearchTerm}
      searchChange={onSearchChange}
      // renderDropDown={articleAdditionalData}
      // hmmmm
      // excludeFooter={!hasData || hasError}
      // searchable={!hasError}
    >
      <Table.Column
        id="oai"
        display="OAI"
        order="any"
        icon
        sortDirection={sortConfig.field === 'oai' ? sortConfig.direction : null}
        onClick={() => handleSort('oai')}
        getter={(v) => v.oai.split(':').pop()}
        className={styles.oaiColumn}
      />
      <Table.Column
        id="title"
        display="Title"
        order="any"
        icon
        sortDirection={
          sortConfig.field === 'title' ? sortConfig.direction : null
        }
        onClick={() => handleSort('title')}
        className={styles.titleColumn}
      />
      <Table.Column
        id="authors"
        display="Authors"
        order="any"
        icon
        sortDirection={
          sortConfig.field === 'authors' ? sortConfig.direction : null
        }
        onClick={() => handleSort('authors')}
        className={styles.authorsColumn}
        getter={(v) => v.authors && v.authors.map((a) => a.name).join(' ')}
      />
      <PublicationDateColumn
        id="publicationDate"
        display="Publication date"
        order="any"
        icon
        sortDirection={
          sortConfig.field === 'publicationDate' ? sortConfig.direction : null
        }
        onClick={() => handleSort('publicationDate')}
        className={styles.depositDateColumn}
      />
      <Table.Column
        id="publicReleaseDate"
        display="Deposit date"
        order="desc"
        icon
        sortDirection={
          sortConfig.field === 'publicReleaseDate' ? sortConfig.direction : null
        }
        onClick={() => handleSort('publicReleaseDate')}
        className={styles.depositDateColumn}
        getter={(v) => formatDate(v.publicReleaseDate)}
      />
      {!hasError && (
        <Table.Sidebar>
          <SidebarContent />
        </Table.Sidebar>
      )}
      <Table.Action>
        <ExportButton href={datesUrl}>{texts.exporting.download}</ExportButton>
      </Table.Action>
    </Tablev2>
  )
}

const TableCard = ({
  datesUrl,
  publicReleaseDatesPages,
  checkBillingType,
  isPublicReleaseDatesInProgress,
  publicReleaseDatesError,
  totalCount,
  sortConfig,
  setSortConfig,
}) => {
  const hasData = useObserver(
    () => publicReleaseDatesPages && publicReleaseDatesPages.length > 0
  )
  const error = useObserver(() => publicReleaseDatesError)

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
        publicReleaseDatesPages={publicReleaseDatesPages}
        datesUrl={datesUrl}
        checkBillingType={checkBillingType}
        totalCount={totalCount}
        isPublicReleaseDatesInProgress={isPublicReleaseDatesInProgress}
        publicReleaseDatesError={publicReleaseDatesError}
        setSortConfig={setSortConfig}
        sortConfig={sortConfig}
      />
      {error instanceof PaymentRequiredError && (
        <Card.Footer className={classNames.use(hasData && styles.backdrop)}>
          <PaymentRequiredNote template={texts.paymentRequired} />
        </Card.Footer>
      )}
    </Card>
  )
}

export default TableCard
