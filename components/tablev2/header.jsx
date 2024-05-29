import React from 'react'
import { Table } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import sort from '../upload/assets/sort.svg'
import styles from '../table/styles.module.css'

const Header = React.memo(({ isHeaderClickable = true, columns }) => (
  <Table.Head>
    <Table.Row>
      {columns.map(
        ({
          props: {
            id,
            className: columnClassName,
            display,
            icon,
            sortDirection,
            onClick,
          },
        }) =>
          isHeaderClickable ? (
            <Table.HeadCell key={id} className={columnClassName}>
              {display}
              {icon && (
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
            <Table.Cell key={id} className={columnClassName}>
              {display}
            </Table.Cell>
          )
      )}
    </Table.Row>
  </Table.Head>
))

export default Header
