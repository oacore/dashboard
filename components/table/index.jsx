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

class InfiniteTable extends React.Component {
  constructor(props) {
    super(props)
    // eslint-disable-next-line react/state-in-constructor
    this.state = {
      data: [],
      page: 0,
      areSelectedAll: false,
      searchTerm: '',
      isLastPageLoaded: false,
      isEmpty: false,
      isFirstPageLoaded: false,
      dataRequestCount: 0,
      isSearchChanging: false,
      columnOrder: props.config.columns.reduce((acc, curr) => {
        acc[curr.id] = curr.order !== undefined ? curr.order : null
        return acc
      }, {}),
    }
  }

  async componentDidMount() {
    const { fetchData } = this.props
    const { pageNumber, searchTerm, columnOrder } = this.state

    if (pageNumber === 0) {
      this.setState({
        isFirstPageLoaded: false,
      })
    }

    this.setState(state => ({
      dataRequestCount: state.dataRequestCount + 1,
    }))

    try {
      const page = await fetchData(pageNumber, searchTerm, columnOrder).promise
      const { data } = page
      const newState = { data }

      if (page.isLast) newState.isLastPageLoaded = true
      if (data.length === 0 && pageNumber === 0) newState.isEmpty = true
      if (pageNumber === 0) newState.isFirstPageLoaded = true

      this.setState(state => ({
        ...newState,
        dataRequestCount: state.dataRequestCount - 1,
      }))
      return data
    } catch (error) {
      this.setState(state => ({
        dataRequestCount: state.dataRequestCount - 1,
      }))
      throw error
    }
  }

  componentWillUnmount() {
    if (this.observer) this.observer.disconnect()
  }

  onSearchEnded = debounce(() => this.setState({ isSearchChanging: false }))

  observe = c => {
    if (!this.observer) {
      this.observer = new IntersectionObserver(
        entries => {
          if (!entries[0].isIntersecting) return
          // Only one element is observed for now.
          const newPage = parseInt(
            entries[0].target.getAttribute('pagenumber'),
            10
          )
          this.setState({ page: newPage })
        },
        { threshold: 1, rootMargin: '100px' }
      )
    }
    if (!c) return
    this.observer.observe(c)
  }

  unObserve = c => {
    this.observer.unobserve(c)
  }

  toggleSelectAll = () => {
    this.setState(s => ({ areSelectedAll: !s.areSelectedAll }))
  }

  toggleOrder = id => {
    const { columnOrder } = this.state
    if (columnOrder[id] === undefined) return

    this.setState({
      columnOrder: Object.entries(columnOrder).reduce(
        (acc, [currId, currOrder]) => {
          if (currId === id) acc[currId] = getNextOrder(currOrder)
          else if (currOrder === null) acc[currId] = null
          else acc[currId] = ''

          return acc
        },
        {}
      ),
    })
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
      data,
      page,
      areSelectedAll,
      searchTerm,
      columnOrder,
      isLastPageLoaded,
      isEmpty,
      isFirstPageLoaded,
      dataRequestCount,
      isSearchChanging,
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
                isEmpty: false,
                isSearchChanging: true,
              })
              this.onSearchEnded()
            }}
            value={searchTerm}
          />
        )}
        <Table {...restProps}>
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

          {!isEmpty &&
            !isSearchChanging &&
            data.map(row => {
              const props = {
                id: row.id,
                handleClick: () => {},
                handleSelect: () => {},
                selectable,
                isSelected: false, // TODO
                content: { ...row },
                config,
                isExpanded: false, // TODO
                expandable,
              }

              return (
                <React.Fragment key={row.id}>
                  <TableRow key={row.id} {...props} />
                  {expandable && (
                    <TableRowExpanded key={`${row.id}-expanded`} {...props} />
                  )}
                </React.Fragment>
              )
            })}

          {!isEmpty &&
            !isLastPageLoaded &&
            isFirstPageLoaded &&
            dataRequestCount === 0 && (
              <LoadMoreRow
                pageNumber={page + 1}
                observe={this.observe}
                unObserve={this.unObserve}
                handleManualLoad={() => this.setState({ page: page + 2 })}
              />
            )}
          {isEmpty && dataRequestCount === 0 && <NoDataFoundRow />}

          {dataRequestCount !== 0 && (
            <Table.Row>
              <Table.Cell colSpan={1000}>Loading data</Table.Cell>
            </Table.Row>
          )}
        </Table>
      </>
    )
  }
}

export default withErrorBoundary(InfiniteTable, 'table')
