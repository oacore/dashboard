import React, { Fragment } from 'react'
import { Table } from '@oacore/design'

import TableRow from './row'
import NoDataFoundRow from './no-data-found-row'

const Body = React.memo(
  ({
    handleRowClick,
    handleDoubleRowClick,
    data,
    isClickable,
    columns,
    details,
    expandedRowId,
    rowActionProp,
  }) => (
    <Table.Body onDoubleClick={handleDoubleRowClick}>
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
            isClickable,
          }
          return (
            <Fragment key={row.id}>
              <TableRow
                key={row.id}
                {...props}
                onClick={
                  rowActionProp ? () => handleRowClick(row) : handleRowClick
                }
              />
              {details &&
                React.cloneElement(details, {
                  context: expandedRowId,
                  children:
                    row.id === expandedRowId ? details.props.children : null,
                })}
            </Fragment>
          )
        })}
      {data !== null && data?.length === 0 && <NoDataFoundRow />}
    </Table.Body>
  )
)
export default Body
