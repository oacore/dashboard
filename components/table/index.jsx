import React from 'react'

import LoadMoreRow from './LoadMoreRow'
import tableClassNames from './index.css'
import NoDataFoundRow from './NoDataFoundRow'
import TableRow from './TableRow'
import TableRowExpanded from './TableRowExpanded'

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
  constructor(props) {
    super(props)
    this.tableRef = React.createRef()

    // eslint-disable-next-line react/state-in-constructor
    this.state = {
      data: null,
      page: 0,
      showPrevLoad: false,
      showNextLoad: false,
      sliceWindow: [0, WINDOW_SIZE - 1],
      areSelectedAll: false,
      searchTerm: '',
      isFirstPageLoaded: false,
      isLastPageLoaded: false,
      dataRequestCount: 0,
      columnOrder: props.config.columns.reduce((acc, curr) => {
        acc[curr.id] = curr.order !== undefined ? curr.order : null
        return acc
      }, {}),
      rowsState: {},
    }
  }

  async componentDidMount() {
    await this.fetchData()
  }

  componentDidUpdate(prevProps, prevState) {
    const { expandable } = this.props
    const { sliceWindow: prevSliceWindow } = prevState
    const { sliceWindow } = this.state
    if (sliceWindow !== prevSliceWindow) {
      if (sliceWindow[0] !== 0) {
        const rows = this.tableRef.current
          .getElementsByTagName('tbody')[0]
          .getElementsByTagName('tr')

        const lastVisibleRow =
          prevSliceWindow[0] < sliceWindow[0]
            ? rows[rows.length - WINDOW_STEP * (expandable ? 2 : 1) - 1]
            : rows[WINDOW_STEP * (expandable ? 2 : 1) - 1]
        lastVisibleRow.scrollIntoView({
          block: prevSliceWindow[0] < sliceWindow[0] ? 'end' : 'start',
          behavior: 'auto',
        })
      }

      setTimeout(
        () =>
          this.setState(s => ({
            showPrevLoad: s.dataRequestCount === 0 && s.sliceWindow[0] !== 0,
            showNextLoad: s.dataRequestCount === 0 && !s.isLastPageLoaded,
          })),
        100
      )
    }
  }

  onSearchEnded = debounce(() => this.fetchData({ force: true }))

  toggleSelectAll = () => {
    this.setState(s => ({ areSelectedAll: !s.areSelectedAll }))
  }

  toggleOrder = id => {
    const { columnOrder } = this.state
    if (columnOrder[id] === undefined) return

    this.setState(
      {
        page: 0,
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
    const { expandable } = this.props
    if (!expandable) return

    const clickedRow = event.target.closest('tr')
    if (clickedRow.dataset.isClickable) {
      const rowId = clickedRow.dataset.id
      this.setState(s => ({
        rowsState: {
          ...s.rowsState,
          [rowId]: {
            expanded: !(s.rowsState[rowId] && s.rowsState[rowId].expanded),
          },
        },
      }))
    }
  }

  async fetchData({ prev = false, next = false, force = false } = {}) {
    const { fetchData } = this.props
    const {
      page: pageNumber,
      searchTerm,
      columnOrder,
      sliceWindow,
    } = this.state
    const { data } = this.state
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

    this.setState({
      showPrevLoad: false,
      showNextLoad: false,
    })
    // first page load
    if (data === null || force) {
      this.setState(s => ({
        dataRequestCount: s.dataRequestCount + 1,
        isFirstPageLoaded: false,
      }))

      const page = await fetchData(0, searchTerm, columnOrder).promise
      // TODO: This is just temporary fix for preventing duplicate rows
      //  in table. API should not send them at all.
      const newData = page.data.map(e => ({
        ...e,
        id: `${pageNumber}-${e.id}`,
      }))
      this.setState(s => ({
        page: 0,
        isFirstPageLoaded: true,
        isLastPageLoaded: page.isLast,
        dataRequestCount: s.dataRequestCount - 1,
        rowsState: {},
        data: newData,
        showNextLoad: !page.isLast,
        sliceWindow,
      }))
    }

    // not enough data, need to fetch next page
    else if (data.length < upperBound) {
      this.setState(s => ({
        dataRequestCount: s.dataRequestCount + 1,
      }))
      const page = await fetchData(pageNumber + 1, searchTerm, columnOrder)
        .promise
      // TODO: This is just temporary fix for preventing duplicate rows
      //  in table. API should not send them at all.
      const newData = page.data.map(e => ({
        ...e,
        id: `${pageNumber + 1}-${e.id}`,
      }))

      this.setState(s => ({
        page: s.page + 1,
        dataRequestCount: s.dataRequestCount - 1,
        data: [...s.data, ...newData],
        sliceWindow: [lowerBound, upperBound],
      }))
    }
    // data loaded just rerender
    else {
      this.setState({
        sliceWindow: [lowerBound, upperBound],
      })
    }
  }

  render() {
    const {
      config,
      selectable,
      searchable,
      expandable,
      title,
      fetchData,
      ...restProps
    } = this.props
    const {
      sliceWindow,
      data,
      areSelectedAll,
      searchTerm,
      columnOrder,
      dataRequestCount,
      showPrevLoad,
      showNextLoad,
      isFirstPageLoaded,
      isLastPageLoaded,
      rowsState,
    } = this.state

    return (
      <>
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
                page: 0,
                data: null,
                sliceWindow: [0, WINDOW_SIZE - 1],
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
          <Table.Body onClick={this.handleRowClick}>
            {!isFirstPageLoaded && data === null && (
              <Table.Row>
                <Table.Cell colSpan={1000}>Loading data</Table.Cell>
              </Table.Row>
            )}
            {sliceWindow[0] !== 0 && (
              <LoadMoreRow
                isPrev
                observe={showPrevLoad}
                isLoading={Boolean(dataRequestCount)}
                onVisible={() => this.fetchData({ prev: true })}
                offset={sliceWindow[0]}
              />
            )}

            {data !== null &&
              data.slice(...sliceWindow).map((row, index) => {
                const props = {
                  id: row.id,
                  index: index + sliceWindow[0],
                  selectable,
                  isSelected: false, // TODO
                  content: row,
                  config,
                  isExpanded: rowsState[row.id]?.expanded,
                  expandable,
                }

                return (
                  <React.Fragment key={row.id}>
                    <TableRow {...props} />
                    {expandable && <TableRowExpanded {...props} />}
                  </React.Fragment>
                )
              })}

            {isFirstPageLoaded && !isLastPageLoaded && (
              <LoadMoreRow
                isNext
                observe={showNextLoad}
                isLoading={Boolean(dataRequestCount)}
                onVisible={() => this.fetchData({ next: true })}
                offset={sliceWindow[0]}
              />
            )}
            {data && data.length === 0 && <NoDataFoundRow />}
          </Table.Body>
        </Table>
      </>
    )
  }
}

export default withErrorBoundary(InfiniteTable, 'table')
