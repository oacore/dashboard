import React from 'react'
import { Label } from '@oacore/design'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import styles from './content.css'

import TakeDown from 'components/takedown'
import { withGlobalStore } from 'store'
import Table from 'components/table'
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

const SidebarContent = ({
  store,
  context: {
    id,
    identifier: { oai },
    title,
    author,
    link,
  },
}) => {
  const { Header, Body, Footer } = Table.Sidebar
  const fullText = link.find(v => v.type === 'download')
  const displayPage = link.find(v => v.type === 'display')
  return (
    <>
      <Header className={styles.header}>{oai}</Header>
      <Body>
        <p>
          <b>{title}</b>
        </p>
        <p>{author.map(a => a.name).join(' ')}</p>
      </Body>
      <Footer>
        {fullText ? (
          <DocumentLink href={fullText.url}>Open</DocumentLink>
        ) : (
          <DocumentLink href={displayPage.url}>Open</DocumentLink>
        )}
        <TakeDown onClick={() => store.works.changeVisibility(id)} />
      </Footer>
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
      <Table.Sidebar>
        <SidebarContent store={store} />
      </Table.Sidebar>
    </Table>
  </Card>
)

export default withGlobalStore(Data)
