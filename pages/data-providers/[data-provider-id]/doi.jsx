import React from 'react'

import { withGlobalStore } from 'store'
import Table from 'components/table'
import NumericValue, { formatNumber } from 'components/numeric-value'
import ExportButton from 'components/export-button'
import EnrichmentChart from 'components/enrichment-chart'
import Markdown from 'components/markdown'
import * as texts from 'texts/doi'
import { Card, Icon } from 'design'

// TODO: Remove once cards are in @oacore/design
// eslint-disable-next-line
import styles from './doi.css'

const formatDOI = entity => {
  const { crossrefDoi, repoDoi: originDoi } = entity

  if (crossrefDoi && !originDoi) {
    return (
      <>
        {crossrefDoi}{' '}
        <Icon
          className={styles.newIcon}
          src="/design/icons.svg#new"
          alt="New"
        />
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
    <h2>{texts.coverage.title}</h2>
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
      <h2>{texts.exporting.title}</h2>
      <p>
        {texts.exporting.description.render({
          count: store.depositDates.depositDatesCount || '',
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
      <Table
        key={store.dataProvider}
        title="Browse DOI records"
        pages={store.doi.doiRecords}
        className={styles.doiTable}
        searchable
      >
        <Table.Column
          id="repo_doi"
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
          getter={v => v.authors && v.authors.map(a => a.name).join(' ')}
        />
      </Table>
    </Card>
  </Tag>
)

export default withGlobalStore(DepositDates)
