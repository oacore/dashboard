import React from 'react'

import { withGlobalStore } from 'store'
import Table from 'components/table'
import NumericValue from 'components/numeric-value'
import ExportButton from 'components/export-button'
import EnrichmentChart from 'components/enrichment-chart'
import texts from 'texts/doi'
import { Card } from 'design'

// TODO: Remove once cards are in @oacore/design
// eslint-disable-next-line
import styles from './doi.css'

const DepositDates = ({
  className,
  store,
  tag: Tag = 'main',
  ...restProps
}) => (
  <Tag className={[styles.container, className].join(' ')} {...restProps}>
    <h1>DOI</h1>

    <Card className={styles.overviewCard} tag="section">
      <h2>Coverage</h2>
      <div className={styles.overviewCardContent}>
        <div className={styles.overviewCardText}>
          <NumericValue value="10.45%" caption="outputs with DOIs" />
          {2 && (
            <p>
              We have <strong>{2}</strong> DOIs more to enrich your records.
            </p>
          )}
        </div>
        <div className={styles.overviewCardChart}>
          <EnrichmentChart
            value={10}
            increase={2}
            caption={store.dataProvider.name}
          />
        </div>
      </div>
    </Card>

    <Card className={styles.cardTwo} tag="section">
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

    <Card className={styles.doiTable} tag="section">
      <Table
        key={store.dataProvider}
        title="Browse DOI records"
        pages={store.doi.doiRecords}
        searchable
      >
        <Table.Column
          id="repo_doi"
          display="DOI"
          order="any"
          className={styles.doiColumn}
          getter={v =>
            v.crossrefDoi && !v.repoDoi ? `${v.crossrefDoi} 🆕` : v.repoDoi
          }
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
          getter={v => v.authors && v.authors.map(a => a.name).join(' ')}
        />
      </Table>
    </Card>
  </Tag>
)

export default withGlobalStore(DepositDates)
