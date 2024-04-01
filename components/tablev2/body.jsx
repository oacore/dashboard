import React, { Fragment } from 'react'
import { Table } from '@oacore/design'

import TableRow from './row'
import NoDataFoundRow from '../table/no-data-found-row'

const Body = ({ data, columns, handleRowClick, rowActionProp }) => (
  <Table.Body>
    {data === null && (
      <Table.Row>
        <Table.Cell colSpan={1000}>Loading data</Table.Cell>
      </Table.Row>
    )}
    {data !== null &&
      data?.map((row, index) => {
        const props = {
          id: row.id,
          index,
          context: row,
          columns,
        }
        return (
          <Fragment key={row.id}>
            <TableRow
              onClick={
                rowActionProp ? () => handleRowClick(row) : handleRowClick
              }
              key={row.id}
              {...props}
            />
          </Fragment>
        )
      })}
    {data !== null && data?.length === 0 && <NoDataFoundRow />}
  </Table.Body>
)
export default Body
