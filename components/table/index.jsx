import React from 'react'
import { Table, TableHead, TableRow, TableCell } from '@oacore/design'

import TablePage from './TablePage'
import LoadingRow from './LoadingRow'
import { range } from '../../utils/helpers'
import tableClassNames from './index.css'

class InfiniteTable extends React.Component {
  state = {
    page: 0,
    areSelectedAll: false,
  }

  componentWillUnmount() {
    if (this.observer) this.observer.disconnect()
  }

  observe = c => {
    if (!this.observer) {
      this.observer = new IntersectionObserver(
        entries => {
          // Only one element is observed for now.
          const newPage = parseInt(
            entries[0].target.getAttribute('pageNumber'),
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
    const { columns, fetchData, columnRenderers, selectable } = this.props
    const { page, areSelectedAll } = this.state

    return (
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
              <TableCell>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>

        {range(page + 1).map(i => (
          <TablePage
            key={i}
            observe={this.observe}
            pageNumber={i}
            fetchData={fetchData}
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
    )
  }
}

export default InfiniteTable
