import React from 'react'
import Markdown from 'react-markdown'
import dayjs from 'dayjs'

import { withGlobalStore } from 'store'
import Table from 'components/table'
import TimeLagChart from 'components/time-lag-chart'
import { Button, Card, Label } from 'design'
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
      className: styles.titleColumn,
    },
    {
      id: 'author',
      display: 'Authors',
      order: '',
      className: styles.authorsColumn,
    },
    {
      id: 'publicationDate',
      display: 'Publication Date',
      className: styles.depositDateColumn,
      render: v => v.format('DD/MM/YYYY'),
    },
    {
      id: 'publicReleaseDate',
      display: 'Deposit At',
      order: 'desc',
      className: styles.depositDateColumn,
      render: v => v.format('DD/MM/YYYY'),
    },
  ],
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
}) => {
  const fetchData = async (pageNumber, searchTerm, columnOrder) => {
    const page = await store.depositDates.retrieveDepositDates(
      pageNumber,
      searchTerm,
      columnOrder
    )

    return page.data.map(v => ({
      id: v.id,
      oai: v.oai,
      title: v.title,
      author: v.author && v.author.map(a => a.name).join(' '),
      publicationDate: dayjs(v.publicationDate),
      publicReleaseDate: dayjs(v.publicReleaseDate),
    }))
  }

  return (
    <Tag className={[styles.container, className].join(' ')} {...restProps}>
      <h1>Deposit compliance</h1>

      <Card className={styles.complianceLevel} tag="section">
        <h2>{texts.compliance.title}</h2>
        <Markdown>
          {texts.compliance.body.render({
            amount: (100 - store.depositDates.complianceLevel).toFixed(1),
          })}
        </Markdown>
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
          <TimeLagChart data={store.depositDates.timeLagData} />
        )}
        {!store.depositDates.timeLagData.length &&
          !store.depositDates.isRetrieveDepositDatesInProgress &&
          texts.chart.noData}
      </Card>

      <Card className={styles.browseTable} tag="section">
        <Table
          key={store.dataProvider}
          className={styles.table}
          title="Browse deposit dates"
          config={tableConfig}
          fetchData={fetchData}
          searchable
        />
      </Card>
    </Tag>
  )
}

export default withGlobalStore(DepositDates)
