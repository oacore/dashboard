import React, { Fragment, useState } from 'react'
import { Table } from '@oacore/design'

import TableRow from './row'
import NoDataFoundRow from '../table/no-data-found-row'

const Body = ({
  data,
  columns,
  handleRowClick,
  details,
  sidebar,
  expandedRowId,
  rowIdIdentifier,
}) => {
  const [activeElement, setActiveElement] = useState(null)

  const rowClickHandler = (row, index) => {
    if (sidebar) handleRowClick(row)
    else {
      setActiveElement(index === activeElement ? null : index)
      handleRowClick(row)
    }
  }

  return (
    <Table.Body>
      {data === null && (
        <Table.Row>
          <Table.Cell colSpan={1000}>Loading data</Table.Cell>
        </Table.Row>
      )}
      {data?.map((row, index) => {
        const props = {
          id: row[rowIdIdentifier],
          index,
          context: row,
          columns,
          isClickable: true,
          isActive: sidebar
            ? expandedRowId?.[rowIdIdentifier] === row[rowIdIdentifier]
            : index === activeElement,
        }
        return (
          <Fragment key={row[rowIdIdentifier]}>
            <TableRow
              onClick={() => rowClickHandler(row, index)}
              key={row[rowIdIdentifier]}
              {...props}
            />
            {!sidebar &&
              details &&
              index === activeElement &&
              React.cloneElement(details, props)}
          </Fragment>
        )
      })}
      {data !== null && data?.length === 0 && <NoDataFoundRow />}
    </Table.Body>
  )
}

export default Body
