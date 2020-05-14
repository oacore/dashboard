import React from 'react'
import { Table } from '@oacore/design'

import TableRow from './row'
import NoDataFoundRow from './no-data-found-row'

const Body = React.memo(
  ({ handleRowClick, handleDoubleRowClick, data, isClickable, columns }) => (
    <Table.Body onClick={handleRowClick} onDoubleClick={handleDoubleRowClick}>
      {data === null && (
        <Table.Row>
          <Table.Cell colSpan={1000}>Loading data</Table.Cell>
        </Table.Row>
      )}

      {data !== null &&
        data.map((row, index) => {
          const props = {
            id: row.id,
            index,
            context: row,
            columns,
            isClickable,
          }

          return <TableRow key={row.id} {...props} />
        })}
      {data !== null && data.length === 0 && <NoDataFoundRow />}
    </Table.Body>
  )
)
export default Body
