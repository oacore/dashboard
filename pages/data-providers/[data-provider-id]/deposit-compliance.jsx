import React from 'react'
import dayjs from 'dayjs'

import styles from './deposit-compliance.module.css'

import StackedVerticalBarChart from 'components/stacked-vertical-bar-chart'
import NumericValue from 'components/numeric-value'
import { withGlobalStore } from 'store'
import Markdown from 'components/markdown'
import Table from 'components/table'
import TimeLagChart from 'components/time-lag-chart'
import { Card, Button } from 'design'
import * as texts from 'texts/depositing'
import DocumentLink from 'components/document-link'
import ExportButton from 'components/export-button'
import { valueOrDefault } from 'utils/helpers'

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
          value={valueOrDefault(
            store.depositDates.complianceLevel &&
              (100 - store.depositDates.complianceLevel).toFixed(2),
            'Loading...'
          )}
          append="%"
          caption="non-compliant"
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
              nonCompliantCount:
                store.depositDates.crossDepositLag.nonCompliantCount,
              recordsInAnotherRepository:
                store.depositDates.crossDepositLag.possibleBonusCount,
            })
          : 'Loading data'}
      </p>
      <ExportButton href={store.depositDates.crossDepositLagCsvUrL}>
        {texts.crossRepositoryCheck.download}
      </ExportButton>
    </Card>

    <Card tag="section">
      <Card.Title tag="h2">{texts.publicationDates.title}</Card.Title>
      <Card.Description>{texts.publicationDates.description}</Card.Description>
      {store.depositDates.publicationDatesValidate ? (
        <StackedVerticalBarChart
          data={[
            {
              value: store.depositDates.publicationDatesValidate.fullCount,
              caption: texts.publicationDates.matching,
              background: 'var(--success)',
            },
            {
              value: store.depositDates.publicationDatesValidate.partialCount,
              caption: texts.publicationDates.incorrect,
              background: 'var(--warning)',
            },
            {
              value: store.depositDates.publicationDatesValidate.noneCount,
              caption: texts.publicationDates.different,
              background: 'var(--danger)',
              color: 'var(--white)',
            },
          ]}
        />
      ) : (
        <p>Loading data</p>
      )}
      <p>
        <Button className={styles.detailsButton} variant="contained" disabled>
          Details
        </Button>
        Coming soon
      </p>
    </Card>

    <Card
      id="deposit-dates-card"
      className={styles.browseTableCard}
      tag="section"
    >
      <Table
        key={store.dataProvider}
        title="Browse deposit dates"
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
        <Table.Column
          id="publicationDate"
          display="Publication date"
          order="any"
          className={styles.depositDateColumn}
          getter={(v) => dayjs(v.publicationDate).format('DD/MM/YYYY')}
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
