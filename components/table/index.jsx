import React from 'react'
import { Table, TextField } from '@oacore/design'

import TablePage from './TablePage'
import LoadingRow from './LoadingRow'
import { range } from '../../utils/helpers'
import tableClassNames from './index.css'

const getNextOrder = order => {
  if (order === 'asc') return 'desc'
  if (order === 'desc') return 'asc'
  return 'asc'
}

class InfiniteTable extends React.Component {
  state = {
    page: 0,
    areSelectedAll: false,
    searchTerm: '',
    columnOrder: {},
    isLastPageLoaded: false,
  }

  componentDidMount() {
    const { config } = this.props
    this.setState({
      columnOrder: config.columns.reduce((acc, curr) => {
        acc[curr.id] = curr.order !== undefined ? curr.order : null
        return acc
      }, {}),
    })
  }

  componentWillUnmount() {
    if (this.observer) this.observer.disconnect()
  }

  fetchData = async pageNumber => {
    const { searchTerm, columnOrder } = this.state
    const { fetchData } = this.props

    const data = await fetchData(pageNumber, searchTerm, columnOrder)
    if (data.length === 0) this.setState({ isLastPageLoaded: true })
    return data
  }

  observe = c => {
    if (!this.observer) {
      this.observer = new IntersectionObserver(
        entries => {
          // Only one element is observed for now.
          const newPage = parseInt(
            entries[0].target.getAttribute('pagenumber'),
            10
          )
          this.setState({ page: newPage })
        },
        { threshold: 0, rootMargin: '100px' }
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
      page,
      areSelectedAll,
      searchTerm,
      columnOrder,
      isLastPageLoaded,
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
            onChange={event =>
              this.setState({ searchTerm: event.target.value })
            }
            value={searchTerm}
          />
        )}
        <Table {...restProps}>
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
                  className={column.className}
                  order={columnOrder[column.id]}
                  onClick={event => {
                    event.preventDefault()
                    this.toggleOrder(column.id)
                  }}
                >
                  {column.display}
                </Table.HeadCell>
              ))}
            </Table.Row>
          </Table.Head>

          {range(page + 1).map(i => (
            <TablePage
              key={i}
              observe={this.observe}
              pageNumber={i}
              fetchData={this.fetchData}
              unObserve={this.unObserve}
              config={config}
              selectable={selectable}
              areSelectedAll={areSelectedAll}
              expandable={expandable}
              columnOrder={columnOrder}
            />
          ))}

          {!isLastPageLoaded && (
            <LoadingRow
              pageNumber={page + 1}
              observe={this.observe}
              unObserve={this.unObserve}
              handleManualLoad={() => this.setState({ page: page + 1 })}
            />
          )}
        </Table>
      </>
    )
  }
}

export default InfiniteTable
