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
  expandedRowRenderer: ({ content: { title, author } }) => (
    <div>
      <p>
        <b>{title}</b>
      </p>
      <p>{author}</p>
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
