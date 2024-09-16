import React from 'react'
import { observer } from 'mobx-react-lite'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../styles.module.css'

import { formatDate } from 'utils/helpers'
import { Card, DetailList, Icon } from 'design'
import DocumentLink from 'components/document-link'
import TakeDown from 'components/takedown'
import Table from 'components/table'
import useDynamicTableData from 'components/table/hooks/use-dynamic-data'
import ExportButton from 'components/export-button'
import * as texts from 'texts/content'

const SidebarContent = observer(
  ({
    changeVisibility,
    context: {
      id,
      identifiers: { oai, doi },
      title,
      authors,
      links,
      disabled,
      lastUpdate,
    },
  }) => {
    const { Header, Body, Footer } = Table.Sidebar
    const fullText = links.find((v) => v.type === 'download')
    const displayPage = links.find((v) => v.type === 'display')
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
          <div>{authors.map((a) => a.name).join(' ')}</div>
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
              {formatDate(lastUpdate, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
              })}
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

const TableCard = observer(
  ({ works, changeVisibility, exportUrl, ...props }) => {
    const [tableProps, fetchData] = useDynamicTableData({ pages: works })
    return (
      <Card {...props}>
        <Table
          className={styles.contentTable}
          searchable
          fetchData={fetchData}
          {...tableProps}
        >
          <Table.Column
            id="oai"
            display="OAI"
            order="any"
            getter={(v) => {
              const { oai } = v.identifiers
              if (oai) return oai.split(':').pop()
              return '-'
            }}
            className={styles.oaiColumn}
          />
          <Table.Column
            id="title"
            display="Title"
            className={styles.titleColumn}
          />
          <Table.Column
            id="authors"
            display="Authors"
            order="any"
            className={styles.authorsColumn}
            getter={(v) => v.authors.map((a) => a.name).join(' ')}
          />
          <Table.Column
            id="lastUpdate"
            display="Last Update"
            order="desc"
            className={styles.lastUpdateColumn}
            getter={(v) => formatDate(v.lastUpdate)}
          />
          <Table.Sidebar>
            <SidebarContent changeVisibility={changeVisibility} />
          </Table.Sidebar>
          <Table.Action>
            <ExportButton href={exportUrl}>
              {texts.exporting.download}
            </ExportButton>
          </Table.Action>
        </Table>
      </Card>
    )
  }
)

export default TableCard
