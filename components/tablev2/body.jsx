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
          id: row.id,
          index,
          context: row,
          columns,
          isClickable: true,
          isActive: sidebar
            ? expandedRowId?.id === row.id
            : index === activeElement,
        }
        return (
          <Fragment key={row.id}>
            <TableRow
              onClick={() => rowClickHandler(row, index)}
              key={row.id}
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
