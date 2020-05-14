import React, { useRef, useEffect } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import Footer from './footer'
import Header from './header'
import Body from './body'
import useTableConfig from './hooks/use-table-config'
import useTableState from './hooks/use-table-state'

import { Table, TextField, Select } from 'design'
import withErrorBoundary from 'utils/withErrorBoundary'

const InfiniteTable = ({
  config,
  selectable,
  searchable,
  pages,
  className,
  options,
  selectLabel,
  children,
  fetchData: fetchDataProp,
  data,
  size,
  isLastPageLoaded,
  totalLength,
  isLoading,
  excludeFooter = false,
  ...restProps
}) => {
  const tableRef = useRef(null)
  const containerRef = useRef(null)
  const {
    sidebar,
    action,
    columnOrder: columnOrderConfig,
    columns,
  } = useTableConfig(children)

  const [
    { expandedRowId, selectedOption, searchTerm, columnOrder },
    {
      handleSidebarClose,
      handleRowClick,
      handleDoubleRowClick,
      handleSelectedOption,
      handleColumnOrderChange,
      handleSearchChange,
      fetchData,
    },
  ] = useTableState({ columnOrder: columnOrderConfig, fetchDataProp, data })

  // attach event listeners on mount
  useEffect(() => {
    containerRef.current.addEventListener('sidebar-close', handleSidebarClose)
    return () =>
      containerRef.current.removeEventListener(
        'sidebar-close',
        handleSidebarClose
      )
  }, [])

  return (
    <div
      ref={containerRef}
      className={classNames.use({
        [styles.container]: true,
        [styles.open]: Boolean(expandedRowId),
      })}
    >
      <div className={styles.table}>
        {selectable && options.length > 0 && (
          <Select
            options={(s) =>
              options.filter(
                (el) => el.name.toLowerCase().search(s?.toLowerCase()) !== -1
              )
            }
            value={
              selectedOption &&
              options.find((el) => el.id === selectedOption).name
            }
            onSelectionChange={handleSelectedOption}
            label={selectLabel}
          />
        )}
        {searchable && (
          <TextField
            id="search"
            type="search"
            name="search"
            label="Search"
            placeholder="Any identifier, title, author..."
            onChange={handleSearchChange}
            value={searchTerm}
          />
        )}
        <div className={className}>
          <Table ref={tableRef} {...restProps}>
            <Header
              handleColumnOrderChange={handleColumnOrderChange}
              columnOrder={columnOrder}
              columns={columns}
            />
            <Body
              handleRowClick={handleRowClick}
              handleDoubleRowClick={handleDoubleRowClick}
              columns={columns}
              isClickable={Boolean(sidebar)}
              data={data}
            />
            {!excludeFooter && (
              <Footer
                isLastPageLoaded={isLastPageLoaded}
                isFirstPageLoaded={data !== null}
                fetchData={fetchData}
                isLoading={isLoading}
                totalLength={totalLength}
                size={size}
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

export default withErrorBoundary(InfiniteTable, 'table')
