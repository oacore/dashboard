import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import LoadMoreRow from './load-more-row'
import styles from './styles.css'
import NoDataFoundRow from './no-data-found-row'
import TableRow from './row'
import Sidebar from './sidebar'
import Column from './column'

import { Table, TextField } from 'design'
import debounce from 'utils/debounce'
import withErrorBoundary from 'utils/withErrorBoundary'

const getNextOrder = (order) => {
  if (order === 'asc') return 'desc'
  if (order === 'desc') return 'asc'
  return 'asc'
}

// maximum number of rows shown in table at a time
const WINDOW_SIZE = 100

class InfiniteTable extends React.PureComponent {
  tableRowClickTimeout = null

  sidebar = null

  columns = []

  constructor(props) {
    super(props)
    this.tableRef = React.createRef()
    this.containerRef = React.createRef()

    const { sidebar, columnOrder, columns } = this.getConfig()

    // eslint-disable-next-line react/state-in-constructor
    this.state = {
      lastExpandedRow: null,
      data: null,
      showNextLoad: false,
      size: WINDOW_SIZE - 1,
      searchTerm: '',
      isFirstPageLoaded: false,
      isLastPageLoaded: false,
      columnOrder,
      expandedRowId: null,
    }

    this.sidebar = sidebar
    this.columns = columns
  }

  componentDidMount() {
    this.fetchData({ force: true })
    this.containerRef.current.addEventListener(
      'sidebar-close',
      this.closeSidebar
    )
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
    const { searchTerm, columnOrder, showNextLoad, size } = this.state
    let newSize = size

    if (next) newSize += 10
    else newSize = WINDOW_SIZE

    const newState = {
      showNextLoad: false,
    }

    if (force) {
      pages.reset({
        columnOrder,
        searchTerm,
      })

      newState.isFirstPageLoaded = false
      newState.isLastPageLoaded = false
    }

    this.setState(newState)

    const data = await pages.slice(0, newSize)

    this.setState({
      data,
      size: newSize,
      isFirstPageLoaded: pages.isFirstPageLoaded,
      isLastPageLoaded: pages.isLastPageLoaded,
      showNextLoad: force ? true : showNextLoad,
    })
  }

  render() {
    const {
      config,
      selectable,
      searchable,
      title,
      fetchData,
      pages,
      className,
      ...restProps
    } = this.props
    const {
      data,
      searchTerm,
      columnOrder,
      showNextLoad,
      isFirstPageLoaded,
      isLastPageLoaded,
      expandedRowId,
      lastExpandedRow,
    } = this.state
    const { sidebar, columns } = this
    return (
      <div
        ref={this.containerRef}
        className={classNames.use({
          [styles.container]: true,
          [styles.open]: Boolean(expandedRowId),
        })}
      >
        <div className={styles.table}>
          {title && <h2>{title}</h2>}
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
                  showNextLoad: false,
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

                {isFirstPageLoaded && !isLastPageLoaded && (
                  <LoadMoreRow
                    observe={showNextLoad}
                    onVisible={this.loadNextPage}
                  />
                )}
                {data && data.length === 0 && <NoDataFoundRow />}
              </Table.Body>
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
