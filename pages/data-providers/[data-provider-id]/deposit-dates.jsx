import React from 'react'
import { Label, Button } from '@oacore/design'
import dayjs from 'dayjs'

import { withGlobalStore } from 'store'
import Table from 'components/table'
import TimeLagChart from 'components/time-lag-chart'
import { Card } from 'design'

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
      publicReleaseDate: dayjs(v.publicReleaseDate),
    }))
  }

  return (
    <Tag className={[styles.container, className].join(' ')} {...restProps}>
      <h1>Deposit compliance</h1>

      <Card className={styles.complianceLevel} tag="section">
        <h2>Compliance level</h2>
        <p>
          Your deposit compliance is <strong>90%</strong>.
        </p>
        <p>
          Deposit compliance level is a percentage of works that has been
          deposited at least in first 90 days after publishing.
        </p>
      </Card>

      <Card className={styles.export} tag="section">
        <h2>Export</h2>
        <p>
          We have deposit dates for <b>182, 719</b> out of 183,219 works within
          your repository
        </p>
        <Button variant="contained">Download</Button>
      </Card>

      <Card className={styles.depositTimeLag} tag="section">
        <h2>Deposit Time Lag</h2>
        <p>
          The chart displays work distribution per deposit time lag in days.
        </p>
        <TimeLagChart />
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
