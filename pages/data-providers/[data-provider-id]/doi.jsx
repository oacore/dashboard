import React from 'react'

import styles from './doi.module.css'

import Table from 'components/table'
import { withGlobalStore } from 'store'
import NumericValue, { formatNumber } from 'components/numeric-value'
import ExportButton from 'components/export-button'
import EnrichmentChart from 'components/enrichment-chart'
import Markdown from 'components/markdown'
import * as texts from 'texts/doi'
import { Card, Icon } from 'design'

const formatDOI = (entity) => {
  const { crossrefDoi, repoDoi: originDoi } = entity

  if (crossrefDoi && !originDoi) {
    return (
      <>
        {crossrefDoi}{' '}
        <Icon className={styles.newIcon} src="#new-box" alt="New" />
      </>
    )
  }

  return originDoi
}

const useDefault = (value, substitute = null) =>
  value == null ||
  value === Infinity ||
  value === -Infinity ||
  Number.isNaN(value)
    ? substitute
    : value

const CoverageCard = ({ dataProviderName, doiCount, enrichmentSize }) => (
  <Card className={styles.overviewCard} tag="section">
    <Card.Title tag="h2">{texts.coverage.title}</Card.Title>
    <div className={styles.overviewCardContent}>
      <div className={styles.overviewCardText}>
        <NumericValue
          value={useDefault(formatNumber(doiCount), 'Loading...')}
          caption={texts.coverage.numberLabel}
        />
        {enrichmentSize > 0 && (
          <Markdown>
            {texts.coverage.body.render({
              count: formatNumber(enrichmentSize),
            })}
          </Markdown>
        )}
      </div>
      <div className={styles.overviewCardChart}>
        <EnrichmentChart
          value={doiCount}
          increase={enrichmentSize}
          caption={dataProviderName}
        />
      </div>
    </div>
  </Card>
)

const DepositDates = ({
  className,
  store,
  tag: Tag = 'main',
  ...restProps
}) => (
  <Tag className={[styles.container, className].join(' ')} {...restProps}>
    <h1>DOI</h1>

    <CoverageCard
      dataProviderName={store.dataProvider.name}
      doiCount={store.doi.originCount}
      enrichmentSize={store.doi.enrichmentSize}
    />

    <Card className={styles.exportCard} tag="section">
      <Card.Title tag="h2">{texts.exporting.title}</Card.Title>
      <p>
        {texts.exporting.description.render({
          count: store.doi.enrichmentSize || '',
        })}
      </p>
      <ExportButton
        href={store.doi.doiUrl}
        disabled={store.doi.isExportDisabled}
      >
        {texts.exporting.download}
      </ExportButton>
    </Card>

    <Card className={styles.doiTableCard} tag="section">
      <Card.Title tag="h2">Browse DOI records</Card.Title>
      <Table
        key={store.dataProvider}
        pages={store.doi.doiRecords}
        className={styles.doiTable}
        searchable
      >
        <Table.Column
          id="repoDoi"
          display={texts.table.columns.doi}
          order="any"
          className={styles.doiColumn}
          getter={formatDOI}
        />
        <Table.Column
          id="title"
          display={texts.table.columns.title}
          order="any"
          className={styles.titleColumn}
        />
        <Table.Column
          id="authors"
          display={texts.table.columns.authors}
          order="any"
          className={styles.authorsColumn}
          getter={(v) => v.authors && v.authors.map((a) => a.name).join(' ')}
        />
      </Table>
    </Card>
  </Tag>
)

export default withGlobalStore(DepositDates)
