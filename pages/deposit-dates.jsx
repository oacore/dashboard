import React from 'react'
import { Label, Button } from '@oacore/design'
import classNames from 'classnames'

import Table from '../components/table'
import { range } from '../utils/helpers'
import dataClassNames from './data.css'
import styles from './deposit-dates.css'

import { Card } from 'design'

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
      render: (v, isExpanded) => (
        <Label
          color="primary"
          className={classNames(dataClassNames.labelSmall, {
            [dataClassNames.labelExpanded]: isExpanded,
          })}
        >
          {v}
        </Label>
      ),
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
    oai: Math.random(),
    title:
      'Zero and low carbon buildings: A drive for change' +
      ' in working practices and the use of computer modelling',
    authors: 'Robina Hetherington, Robin Laney, Stephen Peake',
    lastUpdate: '12 days ago',
  }))
}

const DepositDates = () => {
  return (
    <>
      <h1>Deposit compliance</h1>
      <div className={styles.container}>
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
      </div>
    </>
  )
}

export default DepositDates
