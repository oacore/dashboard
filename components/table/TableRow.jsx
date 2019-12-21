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
  expandable,
}) => {
  const columnConfig = cellId => columns.find(v => v.id === cellId) || {}

  const cellRenderer = (config, cellValue) => {
    if (config.render) return config.render(cellValue, isExpanded)
    return cellValue
  }
  const rowProp = {
    onClick: expandable ? handleClick : undefined,
    className: tableClassNames.mainRow,
    'aria-expanded': expandable ? isExpanded : undefined,
    'aria-controls': expandable ? `${id}-expanded` : undefined,
  }

  return (
    <Table.Row {...rowProp}>
      {selectable && (
        <Table.Cell className={tableClassNames.tableSelect}>
          <input type="checkbox" checked={isSelected} onChange={handleSelect} />
        </Table.Cell>
      )}
      {Object.entries(content).map(([cellId, cellValue]) => {
        const colConfig = columnConfig(cellId)
        const colSpan = isExpanded ? colConfig.expandedSize : 1

        if (colSpan === null || Object.entries(colConfig).length === 0)
          return null
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
