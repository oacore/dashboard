import React from 'react'
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
      expandedSize: 2,
      className: styles.labelColumn,
      order: '',
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
      order: '',
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
      const fullText = link.find(v => v.type === 'download')
      const displayPage = link.find(v => v.type === 'display')

      return (
        <div>
          <p>
            <b>{title}</b>
          </p>
          <p>{author.map(a => a.name).join(' ')}</p>
          {fullText || displayPage ? (
            // We want to pass referrer tag to our website
            // eslint-disable-next-line react/jsx-no-target-blank
            <a href={fullText?.url || displayPage?.url} target="_blank" rel="noopener">
              <Alert variant="info">
                <Alert.Header>
                  <Icon src="/design/icons.svg#download" aria-hidden />
                  {fullText ? 'Fulltext available' : 'Show in CORE'}
                </Alert.Header>
              </Alert>
            </a>
          ) : (
            <Alert variant="danger">
              <Alert.Header>
                <Icon src="/design/icons.svg#download" aria-hidden />
                Fulltext not available
              </Alert.Header>
            </Alert>
          )}
        </div>
      )
    },
  },
}

const Data = ({ store, ...restProps }) => (
  <Card {...restProps}>
    <Table
      key={store.dataProvider}
      config={tableConfig}
      className={styles.contentTable}
      pages={store.works}
      searchable
      expandable
    />
  </Card>
)

export default withGlobalStore(Data)
