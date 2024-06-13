import React, { useContext } from 'react'
import { useObserver } from 'mobx-react-lite'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../styles.module.css'
import checked from '../../../components/upload/assets/checkGreen.svg'
import { GlobalContext } from '../../../store'
import TextWithTooltip from '../../../components/textWithTooltip/textWithtooltip'

import { PaymentRequiredError } from 'store/errors'
import { Card, Icon } from 'design'
import ExportButton from 'components/export-button'
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

const TableCard = ({ pages, exportUrl }) => {
  const { ...globalStore } = useContext(GlobalContext)
  const [tableProps, fetchData] = useDynamicTableData({
    pages,
    defaultSize: 5,
  })
  const hasData = useObserver(() => pages.data && pages.data.length > 0)
  const hasError = useObserver(() => !!pages.error)
  const isExportDisabled = !hasData || hasError

  return (
    <Card className={styles.doiTableCard} tag="section">
      <div className={styles.setHeaderWrapper}>
        <Card.Title tag="h2">Browse DOI records</Card.Title>
        {globalStore?.setSelectedItem && (
          <div>
            <img src={checked} alt="" />
            <span className={styles.setName}>
              <TextWithTooltip
                className={styles.setName}
                text={globalStore.selectedSetName}
              />
            </span>
          </div>
        )}
      </div>
      <Table
        className={classNames.use(
          styles.doiTable,
          pages.error instanceof PaymentRequiredError && styles.muted
        )}
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
        <Table.Action>
          <ExportButton href={exportUrl} disabled={isExportDisabled}>
            {texts.exporting.download}
          </ExportButton>
        </Table.Action>
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
