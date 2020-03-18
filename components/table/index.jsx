import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import LoadMoreRow from './LoadMoreRow'
import tableClassNames from './index.css'
import NoDataFoundRow from './NoDataFoundRow'
import TableRow from './TableRow'
import Sidebar from './Sidebar'

import { Table, TextField } from 'design'
import debounce from 'utils/debounce'
import withErrorBoundary from 'utils/withErrorBoundary'

const getNextOrder = order => {
  if (order === 'asc') return 'desc'
  if (order === 'desc') return 'asc'
  return 'asc'
}

// maximum number of rows shown in table at a time
const WINDOW_SIZE = 100
const WINDOW_STEP = 10

class InfiniteTable extends React.PureComponent {
  tableRowClickTimeout = null

  sidebar = null

  constructor(props) {
    super(props)
    this.tableRef = React.createRef()
    this.containerRef = React.createRef()

    // eslint-disable-next-line react/state-in-constructor
    this.state = {
      lastExpandedRow: null,
      data: null,
      showPrevLoad: false,
      showNextLoad: false,
      sliceWindow: [0, WINDOW_SIZE - 1],
      areSelectedAll: false,
      searchTerm: '',
      isFirstPageLoaded: false,
      isLastPageLoaded: false,
      isLoading: false,
      columnOrder: props.config.columns.reduce((acc, curr) => {
        acc[curr.id] = curr.order !== undefined ? curr.order : null
        return acc
      }, {}),
      rowsState: {},
      expandedRowId: null,
    }

    props.pages.columnOrder = props.config.columns.reduce((acc, curr) => {
      acc[curr.id] = curr.order !== undefined ? curr.order : null
      return acc
    }, {})
    this.pages = props.pages

    const { sidebar } = this.getConfig()
    this.sidebar = sidebar
  }

  componentDidMount() {
    this.fetchData({ force: true })
    this.containerRef.current.addEventListener(
      'sidebar-close',
      this.closeSidebar
    )
  }

  componentDidUpdate(prevProps, prevState) {
    const { sliceWindow: prevSliceWindow } = prevState
    const { sliceWindow } = this.state
    if (
      sliceWindow[0] !== prevSliceWindow[0] &&
      sliceWindow[1] !== prevSliceWindow[1]
    ) {
      if (sliceWindow[0] !== 0) {
        const rows = this.tableRef.current
          .getElementsByTagName('tbody')[0]
          .getElementsByTagName('tr')

        const lastVisibleRow =
          prevSliceWindow[0] < sliceWindow[0]
            ? rows[rows.length - WINDOW_STEP - 1]
            : rows[WINDOW_STEP - 1]
        lastVisibleRow.scrollIntoView({
          block: prevSliceWindow[0] < sliceWindow[0] ? 'end' : 'start',
          behavior: 'auto',
        })

        setTimeout(
          () =>
            this.setState(s => ({
              showPrevLoad: !s.isLoading && s.sliceWindow[0] !== 0,
              showNextLoad: !s.isLoading && !s.isLastPageLoaded,
            })),
          100
        )
      }
    }
  }

  componentWillUnmount() {
    this.containerRef.current.removeEventListener(
      'sidebar-close',
      this.closeSidebar
    )
  }

  onSearchEnded = debounce(() => this.fetchData({ force: true }))

  getConfig() {
    // TODO: create columns API too
    const { children } = this.props
    const childrenArray = React.Children.toArray(children)
    return {
      sidebar: childrenArray.find(item => item.type === Sidebar),
    }
  }

  closeSidebar = () => {
    this.setState({
      expandedRowId: null,
    })
  }

  toggleSelectAll = () => {
    this.setState(s => ({ areSelectedAll: !s.areSelectedAll }))
  }

  toggleOrder = id => {
    const { columnOrder } = this.state
    if (columnOrder[id] === undefined) return

    this.setState(
      {
        columnOrder: Object.entries(columnOrder).reduce(
          (acc, [currId, currOrder]) => {
            if (currId === id) acc[currId] = getNextOrder(currOrder)
            else if (currOrder === null) acc[currId] = null
            else acc[currId] = ''

            return acc
          },
          {}
        ),
      },
      () => this.fetchData({ force: true })
    )
  }

  handleRowClick = event => {
    if (event.detail === 1) {
      const clickedRow = event.target.closest('tr')
      this.tableRowClickTimeout = setTimeout(() => {
        if (!this.sidebar) return

        // ignore copy event
        const selection = window.getSelection().toString()
        if (selection.length) return

        const rowId = clickedRow.dataset.id
        this.setState(s => ({
          expandedRowId: s.expandedRowId === rowId ? null : rowId,
          lastExpandedRow: s.data?.find(e => e.id === rowId),
        }))
      }, 200)
    }
  }

  handleDoubleRowClick = () => {
    // Don't expand row on double click. Let user to copy value
    clearTimeout(this.tableRowClickTimeout)
  }

  loadPrevPage = () => this.fetchData({ prev: true })

  loadNextPage = () => this.fetchData({ next: true })

  async fetchData({ prev = false, next = false, force = false } = {}) {
    const { pages } = this
    const { searchTerm, columnOrder, sliceWindow, showNextLoad } = this.state
    let lowerBound = sliceWindow[0]
    let upperBound

    if (prev) {
      lowerBound = Math.max(lowerBound - WINDOW_STEP, 0)
      upperBound = lowerBound + WINDOW_SIZE
    } else if (next) {
      lowerBound += WINDOW_STEP
      upperBound = lowerBound + WINDOW_SIZE
    } else {
      lowerBound = 0
      upperBound = WINDOW_SIZE
    }

    const newState = {
      showPrevLoad: false,
      showNextLoad: false,
      isLoading: true,
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

    const data = await pages.slice(lowerBound, upperBound)

    this.setState({
      sliceWindow: [lowerBound, upperBound],
      data,
      isFirstPageLoaded: pages.isFirstPageLoaded,
      isLastPageLoaded: pages.isLastPageLoaded,
      isLoading: false,
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
      ...restProps
    } = this.props
    const {
      sliceWindow,
      data,
      areSelectedAll,
      searchTerm,
      columnOrder,
      showPrevLoad,
      showNextLoad,
      isFirstPageLoaded,
      isLastPageLoaded,
      rowsState,
      expandedRowId,
      lastExpandedRow,
    } = this.state
    const { sidebar } = this
    const expandedRow = data?.find(e => e.id === expandedRowId)
    return (
      <div
        ref={this.containerRef}
        className={classNames.use({
          [tableClassNames.container]: true,
          [tableClassNames.open]: Boolean(expandedRow),
        })}
      >
        <div className={tableClassNames.table}>
          {title && <h2>{title}</h2>}
          {searchable && (
            <TextField
              id="search"
              type="search"
              name="search"
              label="Search"
              placeholder="Any identifier, title, author..."
              onChange={event => {
                this.setState({
                  searchTerm: event.target.value,
                  data: null,
                  showPrevLoad: false,
                  showNextLoad: false,
                })
                this.onSearchEnded()
              }}
              value={searchTerm}
            />
          )}
          <Table ref={this.tableRef} {...restProps}>
            <colgroup>
              {config.columns.map(column => (
                <col key={column.id} className={column.className} />
              ))}
            </colgroup>

            <Table.Head>
              <Table.Row>
                {selectable && (
                  <Table.Cell className={tableClassNames.tableSelect}>
                    <input
                      type="checkbox"
                      id="table-select-all"
                      onChange={this.toggleSelectAll}
                      checked={areSelectedAll}
                    />
                  </Table.Cell>
                )}
                {config.columns.map(column => (
                  <Table.HeadCell
                    key={column.id}
                    order={columnOrder[column.id]}
                    onClick={event => {
                      if (columnOrder[column.id] === null) return
                      event.preventDefault()
                      this.toggleOrder(column.id)
                    }}
                  >
                    {column.display}
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
              {sliceWindow[0] !== 0 && (
                <LoadMoreRow
                  observe={showPrevLoad}
                  onVisible={this.loadPrevPage}
                />
              )}

              {data !== null &&
                data.map((row, index) => {
                  const props = {
                    id: row.id,
                    index: index + sliceWindow[0],
                    selectable,
                    isSelected: false, // TODO
                    content: row,
                    config,
                    isExpanded: rowsState[row.id]?.expanded,
                  }

                  return (
                    <React.Fragment key={row.id}>
                      <TableRow {...props} />
                    </React.Fragment>
                  )
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
        {sidebar &&
          React.cloneElement(sidebar, {
            context: lastExpandedRow,
            children: lastExpandedRow ? sidebar.props.children : null,
          })}
      </div>
    )
  }
}

InfiniteTable.Sidebar = Sidebar

export default withErrorBoundary(InfiniteTable, 'table')
