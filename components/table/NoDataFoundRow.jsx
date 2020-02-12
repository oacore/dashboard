import React from 'react'
import { Table } from '@oacore/design'

const NoDataFoundRow = React.memo(() => (
  <Table.Row>
    <Table.Cell colSpan={1000}>No data found</Table.Cell>
  </Table.Row>
))

export default NoDataFoundRow
