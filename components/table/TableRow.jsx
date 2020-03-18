import React from 'react'
import { Table } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import tableClassNames from './index.css'

const TableRow = React.memo(props => {
  const { id, index, columns, context, isClickable } = props
  const rowProps = {
    'data-id': id,
    'data-is-clickable': isClickable,
    'className': classNames.use([isClickable && tableClassNames.clickable]),
  }

  return (
    <Table.Row data-index={index} {...rowProps}>
      {columns.map(column => (
        <Table.Cell key={column.props.id}>
          {React.cloneElement(column, { context })}
        </Table.Cell>
      ))}
    </Table.Row>
  )
})

export default TableRow
