import React from 'react'
import { Label } from '@oacore/design'

import Table from 'components/table'
import PublishedToggle from 'components/published-toggle'
import { range } from 'utils/helpers'
import { Card } from 'design'

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
      render: (v, isExpanded) => (
        <Label color="primary">{isExpanded ? v.long : v.short}</Label>
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
      render: (v, isExpanded) => <PublishedToggle isExpanded={isExpanded} />,
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
    id: Math.random(),
    oai: {
      short: 'oai',
      long: Math.random(),
    },
    title:
      'Zero and low carbon buildings: A drive for change' +
      ' in working practices and the use of computer modelling',
    authors: 'Robina Hetherington, Robin Laney, Stephen Peake',
    lastUpdate: '12 days ago',
    visibility: 'visibility',
  }))
}

const Data = props => (
  <Card {...props}>
    <Table
      config={tableConfig}
      fetchData={fetchData}
      selectable
      searchable
      expandable
    />
  </Card>
)

export default Data
