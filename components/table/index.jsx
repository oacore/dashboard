import React from 'react'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TextField,
} from '@oacore/design'

import TablePage from './TablePage'
import LoadingRow from './LoadingRow'
import { range } from '../../utils/helpers'
import tableClassNames from './index.css'

class InfiniteTable extends React.Component {
  state = {
    page: 0,
    areSelectedAll: false,
    searchTerm: '',
  }

  componentWillUnmount() {
    if (this.observer) this.observer.disconnect()
  }

  fetchData = () => {
    const { searchTerm } = this.state
    const { fetchData } = this.props

    return fetchData(searchTerm)
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

  render() {
    const { columns, columnRenderers, selectable, searchable } = this.props
    const { page, areSelectedAll, searchTerm } = this.state

    return (
      <>
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
        <Table>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell className={tableClassNames.tableSelect}>
                  <input
                    type="checkbox"
                    id="table-select-all"
                    onChange={this.toggleSelectAll}
                    checked={areSelectedAll}
                  />
                </TableCell>
              )}
              {columns.map(column => (
                <TableCell key={column}>{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          {range(page + 1).map(i => (
            <TablePage
              key={i}
              observe={this.observe}
              pageNumber={i}
              fetchData={this.fetchData}
              unObserve={this.unObserve}
              columnRenderers={columnRenderers}
              selectable={selectable}
              areSelectedAll={areSelectedAll}
              toggleSelectAll={this.toggleSelectAll}
            />
          ))}

          <LoadingRow
            pageNumber={page + 1}
            observe={this.observe}
            unObserve={this.unObserve}
          />
        </Table>
      </>
    )
  }
}

export default InfiniteTable
