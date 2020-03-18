// eslint-disable-next-line max-classes-per-file
import React from 'react'
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

class OAIColumn extends Table.Column {
  render() {
    const {
      context: {
        identifier: { oai },
      },
    } = this.props

    return <Label color="primary">{oai.split(':').pop()}</Label>
  }
}

// TODO: Move this into sidebar
class VisibilityColumn extends Table.Column {
  render() {
    const {
      store,
      context: { id, disabled },
    } = this.props

    return (
      <PublishedToggle
        className={styles.visibilitySwitch}
        defaultVisibility={!disabled}
        onVisibilityChanged={isVisible =>
          store.works.changeVisibility(id, isVisible)
        }
      />
    )
  }
}

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

const Data = ({ store, ...restProps }) => (
  <Card {...restProps}>
    <Table
      key={store.dataProvider}
      className={styles.contentTable}
      pages={store.works}
      searchable
    >
      <OAIColumn
        id="oai"
        display="OAI"
        order=""
        className={styles.labelColumn}
      />
      <Table.Column id="title" display="Title" className={styles.titleColumn} />
      <Table.Column
        id="authors"
        display="Authors"
        className={styles.authorsColumn}
        getter={v => v.author.map(a => a.name).join(' ')}
      />
      <Table.Column
        id="lastUpdate"
        display="Last Update"
        order="desc"
        className={styles.lastUpdateColumn}
        getter={v => dayjs(v.lastUpdate).fromNow()}
      />
      <VisibilityColumn
        id="visibility"
        display="Visibility"
        order=""
        className={styles.visibilityColumn}
        store={store}
      />
      <Table.Sidebar>
        <SidebarContent />
      </Table.Sidebar>
    </Table>
  </Card>
)

export default withGlobalStore(Data)
