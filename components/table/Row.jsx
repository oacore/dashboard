import React from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { observer } from 'mobx-react'

import tableClassNames from './index.css'

import { Table } from 'design'

const Row = (props) => {
  const { id, index, columns, context, isClickable } = props
  const { disabled } = context
  const rowProps = {
    'data-id': id,
    'data-is-clickable': isClickable,
    'className': classNames.use([
      isClickable && tableClassNames.clickable,
      disabled && tableClassNames.disable,
    ]),
  }

  return (
    <Table.Row data-index={index} {...rowProps}>
      {columns.map((column) => (
        <Table.Cell key={column.props.id}>
          {React.cloneElement(column, { context })}
        </Table.Cell>
      ))}
    </Table.Row>
  )
}

export default observer(Row)
