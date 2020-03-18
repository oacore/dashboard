import React from 'react'
import { Table } from '@oacore/design'

import tableClassNames from './index.css'

const TableRow = React.memo(props => {
  const {
    id,
    index,
    content,
    config: { columns },
    isSelected,
    isExpanded,
    handleSelect,
    selectable,
    expandable,
  } = props
  const cellRenderer = (colConfig, cellValue) => {
    if (colConfig.render) return colConfig.render(cellValue, props)

    return cellValue
  }
  const rowProp = {
    'data-id': id,
    'data-is-clickable': true,
    'className': tableClassNames.mainRow,
    'aria-expanded': expandable ? isExpanded : undefined,
    'aria-controls': expandable ? `${id}-expanded` : undefined,
  }

  return (
    <Table.Row data-index={index} {...rowProp}>
      {selectable && (
        <Table.Cell className={tableClassNames.tableSelect}>
          <input type="checkbox" checked={isSelected} onChange={handleSelect} />
        </Table.Cell>
      )}
      {columns.map(colConfig => {
        const cellValue = colConfig.getter
          ? colConfig.getter(content)
          : content[colConfig.id]

        return (
          <Table.Cell key={colConfig.id}>
            {cellRenderer(colConfig, cellValue)}
          </Table.Cell>
        )
      })}
    </Table.Row>
  )
})

export default TableRow
