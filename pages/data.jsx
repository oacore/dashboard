import React from 'react'
import { Label } from '@oacore/design'

import Table from '../components/table'
import { range } from '../utils/helpers'
import dataClassNames from './data.css'

const sleep = () => {
  return new Promise(resolve => {
    // wait 3s before calling fn(par)
    setTimeout(() => resolve(), 3000)
  })
}

const columns = [
  {
    id: 'oai',
    display: 'OAI',
    sortable: true,
    render: v => <Label color="primary">{v}</Label>,
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
    id: 'last update',
    display: 'Last Update',
    sortable: true,
  },
  {
    id: 'visibility',
    display: 'Visibility',
    sortable: false,
  },
]

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
    visibility: 'visibility',
  }))
}

const Data = () => {
  return (
    <div className={dataClassNames.dataTab}>
      <Table selectable searchable columns={columns} fetchData={fetchData} />
    </div>
  )
}

export default Data
