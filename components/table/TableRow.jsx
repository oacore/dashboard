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
  const cellRenderer = (colConfig, cellValue) => {
    if (colConfig.render) return colConfig.render(cellValue, isExpanded)
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
      {columns.map(colConfig => {
        const cellValue = colConfig.getter
          ? colConfig.getter(content)
          : content[colConfig.id]
        const colSpan = isExpanded ? colConfig.expandedSize : 1

        return (
          <Table.Cell key={colConfig.id} colSpan={colSpan}>
            {cellRenderer(colConfig, cellValue)}
          </Table.Cell>
        )
      })}
    </Table.Row>
  )
}

export default TableRow
