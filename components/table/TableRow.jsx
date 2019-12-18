import React from 'react'
import { Table } from '@oacore/design'

import tableClassNames from './index.css'

const TableRow = ({
  id,
  content,
  config: { columns },
  isSelected,
  isExpanded,
  handleClick,
  handleSelect,
  selectable,
}) => {
  const columnConfig = cellId => {
    return columns.find(v => v.id === cellId) || {}
  }

  const cellRenderer = (config, cellValue) => {
    if (config.render) return config.render(cellValue, isExpanded)

    return cellValue
  }

  return (
    <Table.Row
      onClick={handleClick}
      className={tableClassNames.mainRow}
      aria-expanded={isExpanded}
      aria-controls={`${id}-expanded`}
    >
      {selectable && (
        <Table.Cell className={tableClassNames.tableSelect}>
          <input type="checkbox" checked={isSelected} onChange={handleSelect} />
        </Table.Cell>
      )}
      {Object.entries(content).map(([cellId, cellValue]) => {
        const colConfig = columnConfig(cellId)
        const colSpan = isExpanded ? colConfig.expandedSize : 1

        if (colSpan === null) return null
        return (
          <Table.Cell key={cellId} colSpan={colSpan}>
            {cellRenderer(colConfig, cellValue)}
          </Table.Cell>
        )
      })}
    </Table.Row>
  )
}

export default TableRow
