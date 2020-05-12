import React from 'react'

import styles from '../styles.module.css'

import { Card, Icon } from 'design'
import Table from 'components/table'
import * as texts from 'texts/doi'

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

const TableCard = ({ pages }) => (
  <Card className={styles.doiTableCard} tag="section">
    <Card.Title tag="h2">Browse DOI records</Card.Title>
    <Table pages={pages} className={styles.doiTable} searchable>
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
  </Card>
)

export default TableCard
