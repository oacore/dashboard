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

const columns = ['oai', 'title', 'authors', 'last update', 'Visibility']

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

const columnRenderers = {
  oai: v => <Label color="primary">{v}</Label>,
}

const Data = () => {
  return (
    <div className={dataClassNames.dataTab}>
      <Table
        selectable
        searchable
        columns={columns}
        fetchData={fetchData}
        columnRenderers={columnRenderers}
      />
    </div>
  )
}

export default Data
