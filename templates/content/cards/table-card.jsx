import React from 'react'
import dayjs from 'dayjs'
import { observer } from 'mobx-react-lite'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../styles.module.css'

import { Card, DetailList, Icon } from 'design'
import DocumentLink from 'components/document-link'
import TakeDown from 'components/takedown'
import Table from 'components/table'

const SidebarContent = observer(
  ({
    changeVisibility,
    context: {
      id,
      identifier: { oai, doi },
      title,
      author,
      link,
      disabled,
      lastUpdate,
    },
  }) => {
    const { Header, Body, Footer } = Table.Sidebar
    const fullText = link.find((v) => v.type === 'download')
    const displayPage = link.find((v) => v.type === 'display')
    return (
      <>
        <Header
          className={classNames.use([
            styles.header,
            !fullText && styles.headerDanger,
            disabled && styles.headerDisabled,
          ])}
        >
          {oai}
        </Header>
        <Body className={styles.sidebar}>
          <div>
            <b>{title}</b>
          </div>
          <div>{author.map((a) => a.name).join(' ')}</div>
          <DetailList>
            <DetailList.Item name="Full text">
              <Icon
                className={classNames.use([!fullText && styles.danger])}
                src={`#file-${fullText ? 'check' : 'alert'}`}
                aria-hidden
              />
              {fullText ? 'Available' : 'Unavailable'}
            </DetailList.Item>
            {doi && <DetailList.Item name="DOI">{doi}</DetailList.Item>}
            <DetailList.Item name="Update date">
              {dayjs(lastUpdate).format('Do MMMM YYYY, hh:mm:ss')}
            </DetailList.Item>
          </DetailList>
        </Body>
        <Footer>
          {fullText ? (
            <DocumentLink href={fullText.url}>Open</DocumentLink>
          ) : (
            <DocumentLink href={displayPage.url}>Open</DocumentLink>
          )}
          <TakeDown onClick={() => changeVisibility(id)} disabled={disabled} />
        </Footer>
      </>
    )
  }
)

const TableCard = ({ works, changeVisibility, ...props }) => (
  <Card {...props}>
    <Table className={styles.contentTable} pages={works} searchable>
      <Table.Column
        id="oai"
        display="OAI"
        order="any"
        getter={(v) => {
          const { oai } = v.identifier
          return oai.split(':').pop()
        }}
        className={styles.oaiColumn}
      />
      <Table.Column id="title" display="Title" className={styles.titleColumn} />
      <Table.Column
        id="authors"
        display="Authors"
        order="any"
        className={styles.authorsColumn}
        getter={(v) => v.author.map((a) => a.name).join(' ')}
      />
      <Table.Column
        id="lastUpdate"
        display="Last Update"
        order="desc"
        className={styles.lastUpdateColumn}
        getter={(v) => dayjs(v.lastUpdate).fromNow()}
      />
      <Table.Sidebar>
        <SidebarContent changeVisibility={changeVisibility} />
      </Table.Sidebar>
    </Table>
  </Card>
)

export default TableCard