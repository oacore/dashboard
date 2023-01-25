import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import Pagination from './pagination'
import styles from './styles.module.css'

import { Button, Table, ProgressSpinner } from 'design'

const Footer = React.memo(
  ({
    children,
    isFirstPageLoaded,
    isLastPageLoaded,
    totalLength,
    fetchData,
    size,
    isLoading,
    buttonText = 'Show more',
    buttonVariant = 'outlined',
    buttonClassName,
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
                className={classNames
                  .use(styles.loadNextPage)
                  .join(buttonClassName)}
                variant={buttonVariant}
                onClick={() => fetchData({ next: true })}
              >
                {!isLoading && buttonText}
                {isLoading && (
                  <>
                    Loading...
                    <ProgressSpinner />
                  </>
                )}
              </Button>
            )}
          </div>
        </Table.Cell>
      </Table.Row>
    </Table.Footer>
  )
)

export default Footer
