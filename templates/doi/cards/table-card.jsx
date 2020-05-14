import React from 'react'
import { useObserver } from 'mobx-react-lite'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../styles.module.css'

import { PaymentRequiredError } from 'store/errors'
import { Card, Icon } from 'design'
import Table from 'components/table'
import { PaymentRequiredNote } from 'modules/billing'
import * as texts from 'texts/doi'
import useDynamicTableData from 'components/table/hooks/use-dynamic-data'

const formatDOI = (entity) => {
  const { crossrefDoi, repoDoi: originDoi } = entity

  if (crossrefDoi && !originDoi) {
    return (
      <>
        {crossrefDoi}{' '}
        <Icon className={styles.newIcon} src="#new-box" alt="New" />
      </>
    )
  }

  return originDoi
}

const TableCard = ({ pages }) => {
  const [tableProps, fetchData] = useDynamicTableData({ pages })
  const hasData = useObserver(() => pages.data && pages.data.length > 0)
  const hasError = useObserver(() => !!pages.error)

  return (
    <Card className={styles.doiTableCard} tag="section">
      <Card.Title tag="h2">Browse DOI records</Card.Title>
      <Table
        className={styles.doiTable}
        excludeFooter={hasError || !hasData}
        searchable={!hasError}
        fetchData={fetchData}
        {...tableProps}
      >
        <Table.Column
          id="repoDoi"
          display={texts.table.columns.doi}
          order="any"
          className={styles.doiColumn}
          getter={formatDOI}
        />
        <Table.Column
          id="title"
          display={texts.table.columns.title}
          order="any"
          className={styles.titleColumn}
        />
        <Table.Column
          id="authors"
          display={texts.table.columns.authors}
          order="any"
          className={styles.authorsColumn}
          getter={(v) => v.authors && v.authors.map((a) => a.name).join(' ')}
        />
      </Table>
      {pages.error instanceof PaymentRequiredError && (
        <Card.Footer className={classNames.use(hasData && styles.backdrop)}>
          <PaymentRequiredNote template={texts.paymentRequired} />
        </Card.Footer>
      )}
    </Card>
  )
}

export default TableCard
