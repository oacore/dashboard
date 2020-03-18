import React, { useMemo } from 'react'
import { Label } from '@oacore/design'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import styles from './content.css'

import { withGlobalStore } from 'store'
import Table from 'components/table'
import PublishedToggle from 'components/published-toggle'
import { Card } from 'design'
import DocumentLink from 'components/document-link'

dayjs.extend(relativeTime)

const getTableConfig = store => ({
  columns: [
    {
      id: 'oai',
      display: 'OAI',
      className: styles.labelColumn,
      order: '',
      getter: v => v.identifier,
      render: ({ oai, doi }, { isExpanded }) => (
        <>
          <Label color="primary">
            {isExpanded ? oai : oai.split(':').pop()}
          </Label>
          {isExpanded && <Label className={styles.doiLabel}>{doi}</Label>}
        </>
      ),
    },
    {
      id: 'title',
      display: 'Title',
      className: styles.titleColumn,
    },
    {
      id: 'authors',
      display: 'Authors',
      className: styles.authorsColumn,
      order: '',
      getter: v => v.author.map(a => a.name).join(' '),
    },
    {
      id: 'lastUpdate',
      display: 'Last Update',
      order: 'desc',
      className: styles.lastUpdateColumn,
      getter: v => dayjs(v.lastUpdate),
      render: v => v.fromNow(),
    },
    {
      id: 'visibility',
      display: 'Visibility',
      order: '',
      className: styles.visibilityColumn,
      getter: v => !v.disabled,
      render: (v, { id, isExpanded }) => (
        <PublishedToggle
          className={styles.visibilitySwitch}
          defaultVisibility={v}
          isExpanded={isExpanded}
          onVisibilityChanged={isVisible =>
            store.works.changeVisibility(id, isVisible)
          }
        />
      ),
    },
  ],
})

const SidebarContent = ({
  context: {
    identifier: { oai },
    title,
    author,
    link,
  },
}) => {
  const fullText = link.find(v => v.type === 'download')
  const displayPage = link.find(v => v.type === 'display')
  return (
    <>
      <Table.Sidebar.Header className={styles.header}>
        {oai}
      </Table.Sidebar.Header>
      <div className={styles.content}>
        <p>
          <b>{title}</b>
        </p>
        <p>{author.map(a => a.name).join(' ')}</p>
        {fullText ? (
          <DocumentLink href={fullText.url}>Open full text</DocumentLink>
        ) : (
          <DocumentLink href={displayPage.url}>Open metadata</DocumentLink>
        )}
      </div>
    </>
  )
}

const Data = ({ store, ...restProps }) => {
  const tableConfig = useMemo(() => getTableConfig(store), [])
  return (
    <Card {...restProps}>
      <Table
        key={store.dataProvider}
        config={tableConfig}
        className={styles.contentTable}
        pages={store.works}
        searchable
      >
        <Table.Sidebar>
          <SidebarContent />
        </Table.Sidebar>
      </Table>
    </Card>
  )
}

export default withGlobalStore(Data)
