import React from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { observer } from 'mobx-react-lite'

import styles from './styles.module.css'

import { Table } from 'design'

const Row = (props) => {
  const { id, index, columns, context, isClickable } = props
  const { disabled } = context
  const rowProps = {
    'data-id': id,
    'data-is-clickable': isClickable,
    'className': classNames.use([
      isClickable && styles.clickable,
      disabled && styles.disable,
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
