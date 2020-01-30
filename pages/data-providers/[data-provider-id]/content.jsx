import React, { useCallback } from 'react'
import { Label } from '@oacore/design'
import Icon from '@oacore/design/lib/components/icon'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import styles from './content.css'

import { withGlobalStore } from 'store'
import Table from 'components/table'
import PublishedToggle from 'components/published-toggle'
import { Alert, Card } from 'design'

dayjs.extend(relativeTime)

const tableConfig = {
  columns: [
    {
      id: 'oai',
      display: 'OAI',
      expandedSize: 3,
      className: styles.labelColumn,
      getter: v => v.identifier,
      render: ({ oai, doi }, isExpanded) => (
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
      expandedSize: null,
      className: styles.titleColumn,
    },
    {
      id: 'authors',
      display: 'Authors',
      expandedSize: null,
      className: styles.authorsColumn,
      getter: v => v.author.map(a => a.name).join(' '),
    },
    {
      id: 'lastUpdate',
      display: 'Last Update',
      order: 'desc',
      expandedSize: 1,
      className: styles.lastUpdateColumn,
      getter: v => dayjs(v.lastUpdate),
      render: v => v.fromNow(),
    },
    {
      id: 'visibility',
      display: 'Visibility',
      order: '',
      expandedSize: 1,
      className: styles.visibilityColumn,
      getter: v => !v.disabled,
      render: (v, isExpanded) => (
        <PublishedToggle
          className={styles.visibilitySwitch}
          defaultVisibility={v}
          isExpanded={isExpanded}
          disabled
        />
      ),
    },
  ],
  expandedRow: {
    render: ({ content: { title, author, link } }) => {
      const isFulltext = Boolean(link.find(v => v.type === 'download'))
      return (
        <div>
          <p>
            <b>{title}</b>
          </p>
          <p>{author.map(a => a.name).join(' ')}</p>
          {!isFulltext && (
            <Alert variant="danger">
              <Alert.Header>
                <Icon src="/design/icons.svg#download" aria-hidden />
                Fulltext not available
              </Alert.Header>
              <Alert.Content>
                <b>Document is encrypted</b>
                <br />
                <span>
                  A PDF file was found but had digital restrictions on the file.
                </span>
              </Alert.Content>
            </Alert>
          )}
          {isFulltext && (
            <Alert variant="info">
              <Alert.Header>
                <Icon src="/design/icons.svg#download" aria-hidden />
                Fulltext available
              </Alert.Header>
            </Alert>
          )}
        </div>
      )
    },
  },
}

const Data = ({ store, ...restProps }) => {
  const fetchData = useCallback(
    (...args) => store.works.retrieveWorks(...args),
    []
  )
  return (
    <Card {...restProps}>
      <Table
        key={store.dataProvider}
        config={tableConfig}
        fetchData={fetchData}
        className={styles.contentTable}
        searchable
        expandable
      />
    </Card>
  )
}

export default withGlobalStore(Data)
