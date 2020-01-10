import React from 'react'
import { Label } from '@oacore/design'

import { withGlobalStore } from '../../../store'
import styles from './content.css'

import Table from 'components/table'
import PublishedToggle from 'components/published-toggle'
import { Card } from 'design'

const tableConfig = {
  columns: [
    {
      id: 'oai',
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
      sortable: true,
      expandedSize: null,
      className: styles.authorsColumn,
    },
    {
      id: 'author',
      display: 'Authors',
      sortable: false,
      expandedSize: null,
      className: styles.authorsColumn,
    },
    {
      id: 'last-update',
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

const Data = ({ store, ...restProps }) => {
  const fetchData = async (pageNumber, searchTerm, columnOrder) => {
    const page = await store.works.retrieveWorks(
      pageNumber,
      searchTerm,
      columnOrder
    )

    return page.data.map(v => ({
      id: v.id,
      oai: v.identifier.oai,
      title: v.title,
      author: v.author.map(a => a.name).join(' '),
      'last-update': '12 days ago',
      visibility: true,
    }))
  }

  return (
    <Card {...restProps}>
      <Table
        key={store.dataProvider}
        config={tableConfig}
        fetchData={fetchData}
        className={styles.contentTable}
        selectable
        searchable
        expandable
      />
    </Card>
  )
}

export default withGlobalStore(Data)
