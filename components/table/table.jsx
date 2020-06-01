import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import NoDataFoundRow from './no-data-found-row'
import TableRow from './row'
import Sidebar from './sidebar'
import Column from './column'
import Action from './action'
import Pagination from './pagination'

import { Table, TextField, Button, Select } from 'design'
import debounce from 'utils/debounce'
import withErrorBoundary from 'utils/withErrorBoundary'

const getNextOrder = (order) => {
  if (order === 'asc') return 'desc'
  if (order === 'desc') return 'asc'
  return 'asc'
}

class InfiniteTable extends React.PureComponent {
  tableRowClickTimeout = null

  sidebar = null

  action = null

  columns = []

  defaultRowSize = null

  constructor(props) {
    super(props)
    this.tableRef = React.createRef()
    this.containerRef = React.createRef()
    this.defaultRowSize = props.defaultSize || 100
    const { action, sidebar, columnOrder, columns } = this.getConfig()

    // eslint-disable-next-line react/state-in-constructor
    this.state = {
      lastExpandedRow: null,
      data: null,
      size: this.defaultRowSize,
      searchTerm: '',
      isFirstPageLoaded: false,
      isLastPageLoaded: false,
      columnOrder,
      expandedRowId: null,
      totalLength: null,
      selectedOption: null,
    }

    Object.assign(this, { action, sidebar, columns })
  }

  componentDidMount() {
    this.fetchData({ force: true })
    this.containerRef.current.addEventListener(
      'sidebar-close',
      this.closeSidebar
    )
  }

  componentDidUpdate() {
    const { action, sidebar, columns } = this.getConfig()
    Object.assign(this, { action, sidebar, columns })
  }

  componentWillUnmount() {
    this.containerRef.current.removeEventListener(
      'sidebar-close',
      this.closeSidebar
    )
  }

  onSearchEnded = debounce(() => this.fetchData({ force: true }))

  getConfig() {
    const { children } = this.props
    const childrenArray = React.Children.toArray(children)

    // TODO: Maybe there is a better way for distinguish Column children
    const columns = childrenArray.filter(
      (child) =>
        child.type === Column ||
        Object.prototype.isPrototypeOf.call(Column, child.type)
    )

    const columnOrder = Object.fromEntries(
      columns.map((column) => {
        const { id, order = null } = column.props
        return [id, order]
      })
    )

    return {
      sidebar: childrenArray.find((item) => item.type === Sidebar),
      action: childrenArray.find((item) => item.type === Action),
      columnOrder,
      columns,
    }
  }

  closeSidebar = () => {
    this.setState({
      expandedRowId: null,
    })
  }

  toggleOrder = (id) => {
    const { columnOrder } = this.state
    if (columnOrder[id] == null) return

    this.setState(
      {
        columnOrder: Object.fromEntries(
          Object.entries(columnOrder).map(([currId, currOrder]) => {
            if (currId === id) return [currId, getNextOrder(currOrder)]
            if (currOrder == null) return [currId, null]
            return [currId, 'any']
          })
        ),
      },
      () => this.fetchData({ force: true })
    )
  }

  handleRowClick = (event) => {
    if (event.detail === 1) {
      const clickedRow = event.target.closest('tr')
      this.tableRowClickTimeout = setTimeout(() => {
        if (!this.sidebar) return

        // ignore copy event
        const selection = window.getSelection().toString()
        if (selection.length) return

        const rowId = clickedRow.dataset.id
        this.setState((s) => ({
          expandedRowId: rowId,
          lastExpandedRow: s.data?.find((e) => e.id === rowId),
        }))
      }, 200)
    }
  }

  handleDoubleRowClick = () => {
    // Don't expand row on double click. Let user to copy value
    clearTimeout(this.tableRowClickTimeout)
  }

  loadNextPage = () => this.fetchData({ next: true })

  async fetchData({ next = false, force = false } = {}) {
    const { pages } = this.props
    const { searchTerm, columnOrder, size, selectedOption } = this.state
    let newSize = size

    if (next) newSize += 100
    else newSize = this.defaultRowSize

    if (force) {
      pages.reset({
        columnOrder,
        searchTerm,
        type: selectedOption,
      })

      this.setState({
        isFirstPageLoaded: false,
        isLastPageLoaded: false,
      })
    }

    const data = await pages.slice(0, newSize)

    this.setState({
      data,
      size: newSize,
      isFirstPageLoaded: pages.isFirstPageLoaded,
      isLastPageLoaded: pages.isLastPageLoaded,
      totalLength: pages.totalLength,
    })
  }

  render() {
    const {
      config,
      selectable,
      searchable,
      fetchData,
      pages,
      className,
      defaultSize,
      options,
      selectLabel,
      excludeFooter,
      ...restProps
    } = this.props
    const {
      data,
      searchTerm,
      columnOrder,
      isFirstPageLoaded,
      expandedRowId,
      lastExpandedRow,
      isLastPageLoaded,
      size,
      totalLength,
      selectedOption,
    } = this.state
    const { action, sidebar, columns } = this

    return (
      <div
        ref={this.containerRef}
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
                selectedOption !== null
                  ? options.find((el) => el.id === selectedOption).name
                  : ''
              }
              onSelectionChange={(value) =>
                this.setState({ selectedOption: value }, () =>
                  this.fetchData({ force: true })
                )
              }
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
              onChange={(event) => {
                this.setState({
                  searchTerm: event.target.value,
                  data: null,
                })
                this.onSearchEnded()
              }}
              value={searchTerm}
            />
          )}
          <div className={className}>
            <Table ref={this.tableRef} {...restProps}>
              <Table.Head>
                <Table.Row>
                  {columns.map((column) => (
                    <Table.HeadCell
                      key={column.props.id}
                      order={columnOrder[column.props.id]}
                      onClick={(event) => {
                        if (columnOrder[column.props.id] === null) return
                        event.preventDefault()
                        this.toggleOrder(column.props.id)
                      }}
                      className={column.props.className}
                    >
                      {column.props.display}
                    </Table.HeadCell>
                  ))}
                </Table.Row>
              </Table.Head>
              <Table.Body
                onClick={this.handleRowClick}
                onDoubleClick={this.handleDoubleRowClick}
              >
                {!isFirstPageLoaded && data === null && (
                  <Table.Row>
                    <Table.Cell colSpan={1000}>Loading data</Table.Cell>
                  </Table.Row>
                )}

                {data !== null &&
                  data.map((row, index) => {
                    const props = {
                      id: row.id,
                      index,
                      context: row,
                      columns,
                      isClickable: Boolean(this.sidebar),
                    }

                    return <TableRow key={row.id} {...props} />
                  })}
                {data && data.length === 0 && <NoDataFoundRow />}
              </Table.Body>
              {!excludeFooter && (
                <tfoot className={styles.footer}>
                  <Table.Row>
                    <Table.Cell colSpan={1000}>
                      <div className={styles.footerLeft}>{action}</div>
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
                            className={styles.loadNextPage}
                            onClick={this.loadNextPage}
                          >
                            Show more
                          </Button>
                        )}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                </tfoot>
              )}
            </Table>
          </div>
        </div>
        {sidebar &&
          React.cloneElement(sidebar, {
            context: lastExpandedRow,
            children: lastExpandedRow ? sidebar.props.children : null,
          })}
      </div>
    )
  }
}

export default withErrorBoundary(InfiniteTable, 'table')
