import React, { Fragment, useState } from 'react'
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
    renderDropDown,
    rowActionProp,
  }) => {
    const [selectedRow, setSelectedRow] = useState(null)

    const rowClick = (row) => {
      setSelectedRow(row)
      handleRowClick(row)
      if (row?.id === selectedRow?.id) setSelectedRow(null)
    }

    // eslint-disable-next-line consistent-return
    const renderChildren = (row) => {
      if (renderDropDown && row.id)
        return row.id === selectedRow?.id ? details.props.children : null
      if (row.id)
        return row.id === expandedRowId ? details.props.children : null
    }

    return (
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
                  onClick={rowActionProp ? () => rowClick(row) : handleRowClick}
                />
                {details &&
                  React.cloneElement(details, {
                    context: expandedRowId,
                    children: renderChildren(row),
                  })}
              </Fragment>
            )
          })}
        {data !== null && data?.length === 0 && <NoDataFoundRow />}
      </Table.Body>
    )
  }
)
export default Body
