import React from 'react'
import { Table } from '@oacore/design'

const Header = React.memo(
  ({ columns, handleColumnOrderChange, columnOrder }) => (
    <Table.Head>
      <Table.Row>
        {columns.map(
          ({ props: { id, className: columnClassName, display } }) => (
            <Table.HeadCell
              key={id}
              order={columnOrder[id]}
              onClick={(event) => {
                event.preventDefault()
                handleColumnOrderChange(id)
              }}
              className={columnClassName}
            >
              {display}
            </Table.HeadCell>
          )
        )}
      </Table.Row>
    </Table.Head>
  )
)

export default Header
