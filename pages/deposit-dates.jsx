import React from 'react'
import { Label, Button } from '@oacore/design'

import Table from '../components/table'
import { range } from '../utils/helpers'

import { Card } from 'design'

// TODO: Remove once cards are in @oacore/design
// eslint-disable-next-line
import styles from './deposit-dates.css'

const sleep = () => {
  return new Promise(resolve => {
    // wait 3s before calling fn(par)
    setTimeout(() => resolve(), 3000)
  })
}

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

const DepositDates = () => {
  return (
    <>
      <h1>Deposit compliance</h1>
      <div className={styles.row}>
        <Card className={styles.complianceLevel}>
          <h2>Compliance level</h2>
        </Card>
        <Card className={styles.export}>
          <h2>Export</h2>
          <p>
            We have deposit dates for <b>182, 719</b> out of 183,219 works
            within your repository
          </p>
          <Button variant="contained">Download</Button>
        </Card>
      </div>
      <Card className={styles.depositTimeLag}>
        <h2>Deposit Time Lag</h2>
      </Card>
      <Card className={styles.browseTable}>
        <Table
          className={styles.table}
          title="Browse deposit dates"
          selectable
          config={tableConfig}
          fetchData={fetchData}
        />
      </Card>
    </>
  )
}

export default DepositDates
