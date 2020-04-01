import React from 'react'
import dayjs from 'dayjs'

import { withGlobalStore } from 'store'
import Markdown from 'components/markdown'
import Table from 'components/table'
import TimeLagChart from 'components/time-lag-chart'
import { Card } from 'design'
import * as texts from 'texts/depositing'
import DocumentLink from 'components/document-link'
import ExportButton from 'components/export-button'

// TODO: Remove once cards are in @oacore/design
// eslint-disable-next-line
import styles from './deposit-dates.css'

const SidebarContent = ({ context: { oai, originalId, authors, title } }) => {
  const { Header, Body, Footer } = Table.Sidebar

  return (
    <>
      <Header className={styles.header}>{oai}</Header>
      <Body>
        <p>
          <b>{title}</b>
        </p>
        <p>{authors?.map((a) => a.name).join(' ')}</p>
      </Body>
      <Footer>
        <DocumentLink href={`https://core.ac.uk/display/${originalId}`}>
          Open
        </DocumentLink>
      </Footer>
    </>
  )
}

/**
 * TODO: This is an example of bad design. We have to know structure
 *       of Layout.Main and explicitly pass props.
 *       We should get rid out of it!
 */
const DepositDates = ({
  className,
  store,
  tag: Tag = 'main',
  ...restProps
}) => (
  <Tag className={[styles.container, className].join(' ')} {...restProps}>
    <h1>Deposit compliance</h1>

    <Card className={styles.complianceLevel} tag="section">
      <h2>{texts.compliance.title}</h2>
      {store.depositDates.complianceLevel ? (
        <Markdown>
          {texts.compliance.body.render({
            amount: (100 - store.depositDates.complianceLevel).toFixed(1),
          })}
        </Markdown>
      ) : (
        <p>{texts.noData.body}</p>
      )}
    </Card>

    <Card className={styles.export} tag="section">
      <h2>{texts.exporting.title}</h2>
      <p>
        {texts.exporting.description.render({
          count: store.depositDates.depositDatesCount || '',
        })}
      </p>
      <ExportButton
        href={store.depositDates.datesUrl}
        disabled={store.depositDates.isExportDisabled}
      >
        {texts.exporting.download}
      </ExportButton>
    </Card>

    <Card className={styles.depositTimeLag} tag="section">
      <h2>{texts.chart.title}</h2>
      {store.depositDates.timeLagData.length > 0 && (
        <>
          <TimeLagChart data={store.depositDates.timeLagData} />
          <Markdown>{texts.chart.body}</Markdown>
        </>
      )}
      {!store.depositDates.timeLagData.length &&
        !store.depositDates.isRetrieveDepositDatesInProgress && (
          <p>{texts.noData.body}</p>
        )}
    </Card>

    <Card className={styles.browseTableCard} tag="section">
      <Table
        key={store.dataProvider}
        title="Browse deposit dates"
        pages={store.depositDates.publicReleaseDates}
        className={styles.browseTable}
        searchable
      >
        <Table.Column
          id="oai"
          display="OAI"
          order="any"
          getter={(v) => v.oai.split(':').pop()}
          className={styles.oaiColumn}
        />
        <Table.Column
          id="title"
          display="Title"
          order="any"
          className={styles.titleColumn}
        />
        <Table.Column
          id="authors"
          display="Authors"
          order="any"
          className={styles.authorsColumn}
          getter={(v) => v.authors && v.authors.map((a) => a.name).join(' ')}
        />
        <Table.Column
          id="publicationDate"
          display="Publication date"
          order="any"
          className={styles.depositDateColumn}
          getter={(v) => dayjs(v.publicationDate).format('DD/MM/YYYY')}
        />
        <Table.Column
          id="publicReleaseDate"
          display="Deposit date"
          order="desc"
          className={styles.depositDateColumn}
          getter={(v) => dayjs(v.publicReleaseDate).format('DD/MM/YYYY')}
        />
        <Table.Sidebar>
          <SidebarContent />
        </Table.Sidebar>
      </Table>
    </Card>
  </Tag>
)

export default withGlobalStore(DepositDates)
