import React from 'react'
import { Label, Button } from '@oacore/design'

import { Main } from '../components/layout'
import Table from '../components/table'
import { range } from '../utils/helpers'

import { Card } from 'design'

// TODO: Remove once cards are in @oacore/design
// eslint-disable-next-line
import styles from './deposit-dates.css'

const sleep = () =>
  new Promise(resolve => {
    // wait 3s before calling fn(par)
    setTimeout(() => resolve(), 3000)
  })

const tableConfig = {
  columns: [
    {
      id: 'oai',
      display: 'OAI',
      sortable: true,
      expandedSize: 2,
      className: styles.labelColumn,
      render: v => <Label color="primary">{v.short}</Label>,
    },
    {
      id: 'title',
      display: 'Title',
      sortable: true,
    },
    {
      id: 'authors',
      display: 'Authors',
      sortable: false,
    },
    {
      id: 'deposit-at',
      display: 'Deposit At',
      sortable: true,
    },
  ],
}

const fetchData = async () => {
  // We'll even set a delay to simulate a server here
  await sleep()
  return range(100).map(() => ({
    id: Math.random(),
    oai: {
      short: 'oai',
      long: Math.random(),
    },
    title:
      'Zero and low carbon buildings: A drive for change' +
      ' in working practices and the use of computer modelling',
    authors: 'Robina Hetherington, Robin Laney, Stephen Peake',
    'deposit-at': '12 days ago',
  }))
}

const DepositDates = () => (
  <Main className={styles.container}>
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
      <p>The chart diplays work distribution per deposit time lag in days.</p>
    </Card>

    <Card className={styles.browseTable} tag="section">
      <Table
        className={styles.table}
        title="Browse deposit dates"
        selectable
        config={tableConfig}
        fetchData={fetchData}
      />
    </Card>
  </Main>
)


export default DepositDates
