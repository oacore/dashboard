import React from 'react'
import { Table } from '@oacore/design'

const Header = React.memo(({ isHeaderClickable = true, columns }) => (
  <Table.Head>
    <Table.Row>
      {columns.map(({ props: { id, className: columnClassName, display } }) =>
        isHeaderClickable ? (
          <Table.HeadCell
            key={id}
            // order={columnOrder[id]}
            className={columnClassName}
          >
            {display}
          </Table.HeadCell>
        ) : (
          <Table.Cell
            key={id}
            // order={columnOrder[id]}
            className={columnClassName}
          >
            {display}
          </Table.Cell>
        )
      )}
    </Table.Row>
  </Table.Head>
))

export default Header
