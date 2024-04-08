import React from 'react'
import { Table } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import sort from '../upload/assets/sort.svg'

const Header = React.memo(
  ({
    isHeaderClickable = true,
    columns,
    handleColumnOrderChange,
    columnOrder,
    onClick,
    showAdditionalSort,
    sortDirection,
  }) => (
    <Table.Head>
      <Table.Row>
        {columns.map(({ props: { id, className: columnClassName, display } }) =>
          isHeaderClickable ? (
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
              {showAdditionalSort && id === 'publicationDate' && (
                // eslint-disable-next-line max-len
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                <img
                  className={classNames.use(styles.sortIcon, {
                    [styles.rotateIcon]: sortDirection === 'desc',
                  })}
                  alt="restart-icon"
                  src={sort}
                  onClick={onClick}
                />
              )}
            </Table.HeadCell>
          ) : (
            <Table.Cell
              key={id}
              order={columnOrder[id]}
              className={columnClassName}
            >
              {display}
            </Table.Cell>
          )
        )}
      </Table.Row>
    </Table.Head>
  )
)

export default Header
