import React from 'react'
import dayjs from 'dayjs'
import { classNames } from '@oacore/design/lib/utils'

import styles from './deposit-compliance.module.css'

import StackedVerticalBarChart from 'components/stacked-vertical-bar-chart'
import NumericValue from 'components/numeric-value'
import { withGlobalStore } from 'store'
import Markdown from 'components/markdown'
import Table from 'components/table'
import TimeLagChart from 'components/time-lag-chart'
import { Card, Button, Icon } from 'design'
import * as texts from 'texts/depositing'
import DocumentLink from 'components/document-link'
import ExportButton from 'components/export-button'
import { formatNumber, valueOrDefault } from 'utils/helpers'

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
      publicationDateValidationLevel: status,
    } = this.props.context

    const showStatus = status && status !== 'full'
    const caption = showStatus !== 'full' && statusToCaption(status)

    return (
      <span title={caption}>
        {dayjs(date).format('DD/MM/YYYY')}{' '}
        {showStatus && <MatchingIcon status={status} />}
      </span>
    )
  }
}

const getComplianceLevelNumberProps = (complianceLevel) => {
  if (complianceLevel === null || complianceLevel > 0) {
    return {
      value: 'Loading...',
      append: '%',
      caption: 'non-compliant',
    }
  }

  return {
    value: complianceLevel,
    append: '',
    caption: 'outputs are non-compliant',
  }
}

const PublicationsDatesCard = ({ fullCount, partialCount, noneCount }) => {
  const isLoading = [fullCount, partialCount, noneCount].some(
    (el) => el == null
  )
  const data = [
    {
      value: fullCount,
      caption: texts.publicationDates.matching,
      background: 'var(--success)',
    },
    {
      value: partialCount,
      caption: texts.publicationDates.incorrect,
      background: 'var(--warning)',
    },
    {
      value: noneCount,
      caption: texts.publicationDates.different,
      background: 'var(--danger)',
      color: 'var(--white)',
    },
  ].filter((el) => el.value > 0)

  return (
    <Card tag="section">
      <Card.Title tag="h2">{texts.publicationDates.title}</Card.Title>
      <Card.Description>{texts.publicationDates.description}</Card.Description>
      {isLoading && <p>Loading data</p>}
      {!isLoading && !data.length && <p>No data found</p>}
      {!isLoading && data.length > 0 && <StackedVerticalBarChart data={data} />}
      <p>
        <Button className={styles.detailsButton} variant="contained" disabled>
          Details
        </Button>
        Coming soon
      </p>
    </Card>
  )
}
/**
 * TODO: This is an example of bad design. We have to know structure
 *       of Layout.Main and explicitly pass props.
 *       We should get rid out of it!
 */
const DepositCompliance = ({
  className,
  store,
  tag: Tag = 'main',
  ...restProps
}) => (
  <Tag className={[styles.container, className].join(' ')} {...restProps}>
    <h1>Deposit compliance</h1>

    <Card className={styles.dataOverview} tag="section">
      <Card.Title tag="h2">{texts.dataOverview.title}</Card.Title>
      <div className={styles.numbers}>
        <NumericValue
          tag="p"
          value={valueOrDefault(store.depositDates.totalCount, 'Loading...')}
          caption="outputs counted"
        />
        <NumericValue
          tag="p"
          {...getComplianceLevelNumberProps(store.depositDates.complianceLevel)}
        />
      </div>
      <Button tag="a" href="#deposit-dates-card" variant="contained">
        {texts.dataOverview.redirect}
      </Button>
    </Card>

    <Card className={styles.crossRepositoryCheckRedirect} tag="section">
      <Card.Title tag="h2">{texts.crossRepositoryCheck.title}</Card.Title>
      <NumericValue
        value={valueOrDefault(
          store.depositDates.crossDepositLag?.possibleBonusCount,
          'Loading...'
        )}
        caption="outputs match"
        className={styles.outputsMatch}
      />
      <Button tag="a" variant="contained" href="#cross-repository-check">
        {texts.crossRepositoryCheck.redirect}
      </Button>
    </Card>

    <Card tag="section">
      <Card.Title tag="h2">{texts.chart.title}</Card.Title>
      {store.depositDates.timeLagData?.length > 0 && (
        <>
          <TimeLagChart data={store.depositDates.timeLagData} />
          <Markdown>{texts.chart.body}</Markdown>
        </>
      )}
      {!store.depositDates.timeLagData?.length &&
        !store.depositDates.isRetrieveDepositDatesInProgress && (
          <p>{texts.noData.body}</p>
        )}
    </Card>

    <Card id="cross-repository-check" tag="section">
      <Card.Title tag="h2">{texts.crossRepositoryCheck.title}</Card.Title>
      <Card.Description>
        {texts.crossRepositoryCheck.description}
      </Card.Description>
      <p>
        {store.depositDates.crossDepositLag
          ? texts.crossRepositoryCheck.body.render({
              nonCompliantCount: formatNumber(
                store.depositDates.crossDepositLag.nonCompliantCount
              ),
              recordsInAnotherRepository: formatNumber(
                store.depositDates.crossDepositLag.possibleBonusCount
              ),
            })
          : 'Loading data'}
      </p>
      <ExportButton href={store.depositDates.crossDepositLagCsvUrL}>
        {texts.crossRepositoryCheck.download}
      </ExportButton>
    </Card>

    <PublicationsDatesCard
      fullCount={store.depositDates.publicationDatesValidate?.fullCount}
      partialCount={store.depositDates.publicationDatesValidate?.partialCount}
      noneCount={store.depositDates.publicationDatesValidate?.noneCount}
    />

    <Card
      id="deposit-dates-card"
      className={styles.browseTableCard}
      tag="section"
    >
      <Card.Title tag="h2">Browse deposit dates</Card.Title>
      <Table
        key={store.dataProvider}
        pages={store.depositDates.publicReleaseDates}
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
          getter={(v) => dayjs(v.publicReleaseDate).format('DD/MM/YYYY')}
        />
        <Table.Sidebar>
          <SidebarContent />
        </Table.Sidebar>
        <Table.Action>
          <ExportButton
            href={store.depositDates.datesUrl}
            disabled={store.depositDates.isExportDisabled}
          >
            {texts.exporting.download}
          </ExportButton>
        </Table.Action>
      </Table>
    </Card>
  </Tag>
)

export default withGlobalStore(DepositCompliance)
