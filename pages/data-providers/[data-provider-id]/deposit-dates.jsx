import React from 'react'
import dayjs from 'dayjs'
import Icon from '@oacore/design/lib/components/icon'

import { withGlobalStore } from 'store'
import Markdown from 'components/markdown'
import Table from 'components/table'
import TimeLagChart from 'components/time-lag-chart'
import { Alert, Button, Card, Label } from 'design'
import * as texts from 'texts/depositing'

// TODO: Remove once cards are in @oacore/design
// eslint-disable-next-line
import styles from './deposit-dates.css'

const tableConfig = {
  columns: [
    {
      id: 'oai',
      order: '',
      display: 'OAI',
      sortable: true,
      expandedSize: 2,
      className: styles.labelColumn,
      render: (v, isExpanded) => (
        <Label color="primary">{isExpanded ? v : v.split(':').pop()}</Label>
      ),
    },
    {
      id: 'title',
      display: 'Title',
      order: '',
      expandedSize: null,
      className: styles.titleColumn,
    },
    {
      id: 'authors',
      display: 'Authors',
      order: '',
      expandedSize: null,
      getter: v => v.authors && v.authors.map(a => a.name).join(' '),
      className: styles.authorsColumn,
    },
    {
      id: 'publicationDate',
      display: 'Publication date',
      className: styles.depositDateColumn,
      expandedSize: 1,
      getter: v => dayjs(v.publicationDate),
      render: v => v.format('DD/MM/YYYY'),
    },
    {
      id: 'publicReleaseDate',
      display: 'Deposit date',
      order: 'desc',
      className: styles.depositDateColumn,
      expandedSize: 1,
      getter: v => dayjs(v.publicReleaseDate),
      render: v => v.format('DD/MM/YYYY'),
    },
  ],
  expandedRow: {
    render: ({ content: { originalId, authors, title } }) => (
      <div>
        <p>
          <b>{title}</b>
        </p>
        <p>{authors.map(a => a.name).join(' ')}</p>
        <a
          href={`https://core.ac.uk/display/${originalId}`}
          /* eslint-disable-next-line react/jsx-no-target-blank */
          target="_blank"
          rel="noopener"
        >
          <Alert variant="info">
            <Alert.Header>
              <Icon src="/design/icons.svg#download" aria-hidden />
              Show in CORE
            </Alert.Header>
          </Alert>
        </a>
      </div>
    ),
  },
}

/**
 * TODO: This is an example of bad design. We have to know structure
 *       of Layout.Main and explicitly pass props.
 *       We should get rid out of it!
 */
const DepositDates = ({
  className,
  store,
  tag: Tag = 'main',
  ...restProps
}) => (
  <Tag className={[styles.container, className].join(' ')} {...restProps}>
    <h1>Deposit compliance</h1>

    <Card className={styles.complianceLevel} tag="section">
      <h2>{texts.compliance.title}</h2>
      {store.depositDates.complianceLevel ? (
        <Markdown>
          {texts.compliance.body.render({
            amount: (100 - store.depositDates.complianceLevel).toFixed(1),
          })}
        </Markdown>
      ) : (
        <p>{texts.noData.body}</p>
      )}
    </Card>

    <Card className={styles.export} tag="section">
      <h2>{texts.exporting.title}</h2>
      <p>
        {texts.exporting.description.render({
          count: store.depositDates.depositDatesCount || '',
        })}
      </p>
      <Button
        variant="contained"
        onClick={() => store.depositDates.exportCsv()}
        disabled={
          store.depositDates.isExportInProgress ||
          store.depositDates.isExportDisabled
        }
      >
        {texts.exporting.download}
      </Button>
    </Card>

    <Card className={styles.depositTimeLag} tag="section">
      <h2>{texts.chart.title}</h2>
      {store.depositDates.timeLagData.length > 0 && (
        <>
          <TimeLagChart data={store.depositDates.timeLagData} />
          <Markdown>{texts.chart.body}</Markdown>
        </>
      )}
      {!store.depositDates.timeLagData.length &&
        !store.depositDates.isRetrieveDepositDatesInProgress && (
          <p>{texts.noData.body}</p>
        )}
    </Card>

    <Card className={styles.browseTable} tag="section">
      <Table
        key={store.dataProvider}
        title="Browse deposit dates"
        config={tableConfig}
        pages={store.depositDates.publicReleaseDates}
        searchable
        expandable
      />
    </Card>
  </Tag>
)

export default withGlobalStore(DepositDates)
