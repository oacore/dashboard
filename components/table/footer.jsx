import React from 'react'

import Pagination from './pagination'
import styles from './styles.module.css'

import { Button, Table } from 'design'

const Footer = React.memo(
  ({
    children,
    isFirstPageLoaded,
    isLastPageLoaded,
    totalLength,
    fetchData,
    size,
    isLoading,
  }) => (
    <Table.Footer className={styles.footer}>
      <Table.Row>
        <Table.Cell colSpan={1000}>
          <div className={styles.footerLeft}>{children}</div>
          <div className={styles.footerRight}>
            {isFirstPageLoaded && (
              <Pagination
                size={size}
                total={totalLength}
                isAllLoaded={isLastPageLoaded}
              />
            )}
            {!isLastPageLoaded && (
              <Button
                disabled={isLoading}
                className={styles.loadNextPage}
                onClick={() => fetchData({ next: true })}
              >
                Show more
              </Button>
            )}
          </div>
        </Table.Cell>
      </Table.Row>
    </Table.Footer>
  )
)

export default Footer
