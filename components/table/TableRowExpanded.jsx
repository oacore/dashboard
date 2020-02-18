import React from 'react'
import { Table } from '@oacore/design'
import classNames from 'classnames'

import tableClassNames from './index.css'

const TableRowExpanded = React.memo(
  ({ id, isExpanded, selectable, config: { expandedRow }, ...props }) => (
    <Table.Row
      id={`${id}-expanded`}
      className={classNames(
        tableClassNames.additionalRow,
        tableClassNames.detailRow,
        expandedRow.className,
        {
          [tableClassNames.closed]: !isExpanded,
        }
      )}
      aria-hidden={!isExpanded}
    >
      {selectable && <Table.Cell />}
      <Table.Cell colSpan={1000}>{expandedRow.render(props)}</Table.Cell>
    </Table.Row>
  )
)

export default TableRowExpanded
