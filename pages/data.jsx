import React from 'react'
import { Label } from '@oacore/design'
import classNames from 'classnames'

import Table from '../components/table'
import { range } from '../utils/helpers'
import dataClassNames from './data.css'

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
      expandedSize: null,
    },
    {
      id: 'authors',
      display: 'Authors',
      sortable: false,
      expandedSize: null,
    },
    {
      id: 'last update',
      display: 'Last Update',
      sortable: true,
      expandedSize: 1,
    },
    {
      id: 'visibility',
      display: 'Visibility',
      sortable: false,
      expandedSize: 2,
    },
  ],
  expandedRowRenderer: () => (
    <div>
      CORE welcomes the objectives of Plan S to advance openness in all research
      subject fields as described in its ten principles. Plan S, which was
      initiated by a coalition of 11 European research funders aims to further
      the adoption of open access to European funded research.
    </div>
  ),
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
    visibility: 'visibility',
  }))
}

const Data = () => {
  return (
    <div className={dataClassNames.dataTab}>
      <Table selectable searchable config={tableConfig} fetchData={fetchData} />
    </div>
  )
}

export default Data
