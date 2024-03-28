import React, { useRef, useEffect } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import Select from './select'
import styles from './styles.module.css'
import Footer from './footer'
import Header from './header'
import Body from './body'
import useTableConfig from './hooks/use-table-config'
import useTableState from './hooks/use-table-state'

import { Table, TextField } from 'design'
import withErrorBoundary from 'utils/withErrorBoundary'

const InfiniteTable = ({
  config,
  selectable,
  searchable,
  pages,
  className,
  options,
  selectId,
  selectLabel,
  children,
  fetchData: fetchDataProp,
  data,
  size,
  hidePagination,
  isLastPageLoaded,
  totalLength,
  isHeaderClickable,
  isLoading,
  defaultRowClick,
  buttonVariant,
  buttonText,
  searchChange,
  localSearch,
  localSearchTerm,
  useExpandIcon = false,
  excludeFooter = false,
  rowClick,
  onClick,
  showAdditionalSort,
  sortDirection,
  renderDropDown,
  rowActionProp,
  ...restProps
}) => {
  const tableRef = useRef(null)
  const containerRef = useRef(null)
  const {
    sidebar,
    action,
    details,
    Dropdown,
    columnOrder: columnOrderConfig,
    columns,
  } = useTableConfig(children)

  const [
    { expandedRowId, searchTerm, columnOrder },
    {
      handleSidebarClose,
      handleRowClick,
      handleDoubleRowClick,
      handleRowToggle,
      handleColumnOrderChange,
      handleSearchChange,
      handleSelectedOption,
      fetchData,
    },
  ] = useTableState({
    columnOrder: columnOrderConfig,
    fetchDataProp,
    data,
    defaultRowClick,
  })

  // attach event listeners on mount
  useEffect(() => {
    const instance = containerRef.current
    instance.addEventListener('sidebar-close', handleSidebarClose)
    return () => {
      instance.removeEventListener('sidebar-close', handleSidebarClose)
    }
  }, [])

  const bodyHasCallbacks = Boolean(sidebar || details || Dropdown)

  // even if this is not an actual Hook, it starts from 'use-'
  // to potentially have useCallback() call behind
  const useRowCallback = (handler) => (bodyHasCallbacks ? handler : null)

  const rowAction = sidebar
    ? useRowCallback(handleRowClick)
    : useRowCallback(handleRowToggle)

  return (
    <div
      ref={containerRef}
      className={classNames.use({
        [styles.container]: true,
        [styles.open]: !!expandedRowId && !!sidebar,
      })}
    >
      <div className={styles.table}>
        {selectable && options.length > 0 && (
          <Select
            id={selectId}
            label={selectLabel}
            placeholder={selectLabel}
            options={options}
            onOptionSelected={handleSelectedOption}
          />
        )}
        {searchable && (
          <TextField
            id="table-search"
            type="search"
            name="search"
            label="Search"
            placeholder="Any identifier, title, author..."
            onChange={localSearch ? searchChange : handleSearchChange}
            value={localSearch ? localSearchTerm : searchTerm}
          />
        )}
        <div className={className}>
          <Table ref={tableRef}>
            <Header
              handleColumnOrderChange={handleColumnOrderChange}
              columnOrder={columnOrder}
              columns={columns}
              isHeaderClickable={isHeaderClickable}
              onClick={onClick}
              showAdditionalSort={showAdditionalSort}
              sortDirection={sortDirection}
            />
            <Body
              renderDropDown={renderDropDown}
              handleRowClick={rowClick || rowAction}
              rowActionProp={rowActionProp}
              handleDoubleRowClick={useRowCallback(handleDoubleRowClick)}
              columns={columns}
              isClickable={bodyHasCallbacks}
              data={data}
              details={details}
              Dropdown={Dropdown}
              useExpandIcon={useExpandIcon}
              expandedRowId={expandedRowId?.id}
            />
            {!excludeFooter && (
              <Footer
                buttonVariant={buttonVariant}
                buttonText={buttonText}
                isLastPageLoaded={isLastPageLoaded}
                isFirstPageLoaded={data !== null}
                fetchData={fetchData}
                isLoading={isLoading}
                totalLength={totalLength}
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

export default withErrorBoundary(InfiniteTable, 'table')
