import React, { useRef } from 'react'
import { Table } from '@oacore/design'

import styles from '../table/styles.module.css'
import Body from './body'
import useTableConfig from '../table/hooks/use-table-config'
import Header from './header'
import Footer from './footer'
import { TextField } from '../../design'

const Tablev2 = ({
  data,
  className,
  children,
  isHeaderClickable,
  buttonText,
  totalLength,
  size,
  hidePagination,
  restProps,
  searchable,
  localSearchTerm,
  searchChange,
  fetchData,
  rowClick,
  rowActionProp,
  renderDropDown,
  details,
  rowAction,
  isLoading,
  excludeFooter = false,
}) => {
  const tableRef = useRef(null)
  const containerRef = useRef(null)
  const { action, columns } = useTableConfig(children)

  return (
    <div ref={containerRef}>
      <div className={styles.table}>
        {searchable && (
          <TextField
            id="table-search"
            type="search"
            name="search"
            label="Search"
            placeholder="Any identifier, title, author..."
            onChange={searchChange}
            value={localSearchTerm}
          />
        )}
        <div className={className}>
          <Table ref={tableRef}>
            <Header isHeaderClickable={isHeaderClickable} columns={columns} />
            <Body
              renderDropDown={renderDropDown}
              handleRowClick={rowClick || rowAction}
              rowActionProp={rowActionProp}
              columns={columns}
              data={data}
              details={details}
            />
            {!excludeFooter && (
              <Footer
                buttonText={buttonText}
                isFirstPageLoaded={data !== null}
                fetchData={fetchData}
                totalLength={totalLength}
                isLoading={isLoading}
                size={size}
                hidePagination={hidePagination}
                {...restProps}
              >
                {action}
              </Footer>
            )}
          </Table>
        </div>
      </div>
    </div>
  )
}

export default Tablev2
