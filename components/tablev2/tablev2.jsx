import React, { useEffect, useRef } from 'react'
import { Table } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

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
  isLoading,
  excludeFooter = false,
}) => {
  const tableRef = useRef(null)
  const containerRef = useRef(null)
  const { action, columns, sidebar } = useTableConfig(children)
  const [expandedRowId, setExpandedRowId] = React.useState(null)

  const handleSidebarClose = () => {
    setExpandedRowId(null)
  }

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const instance = containerRef.current
    if (instance) {
      instance.addEventListener('sidebar-close', handleSidebarClose)
      return () => {
        instance.removeEventListener('sidebar-close', handleSidebarClose)
      }
    }
  }, [])

  const handleRowClick = (row) => {
    if (sidebar) {
      setExpandedRowId(expandedRowId?.id === row.id ? null : row)
      if (rowClick) rowClick(row)
    } else if (rowClick) rowClick(row)
  }

  return (
    <div
      ref={containerRef}
      className={classNames.use({
        [styles.container]: true,
        [styles.open]: !!expandedRowId && !!sidebar,
      })}
    >
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
              handleRowClick={handleRowClick}
              rowActionProp={rowActionProp}
              columns={columns}
              data={data}
              details={details}
              sidebar={sidebar}
              expandedRowId={expandedRowId}
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
      {sidebar &&
        React.cloneElement(sidebar, {
          context: expandedRowId,
          children: expandedRowId ? sidebar.props.children : null,
        })}
    </div>
  )
}

export default Tablev2
