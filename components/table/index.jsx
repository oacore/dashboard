import React from 'react'

import TablePage from './TablePage'
import LoadingRow from './LoadingRow'
import { range } from '../../utils/helpers'

import './index.css'

class Table extends React.Component {
  state = {
    page: 0,
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

  render() {
    const { columns, fetchData } = this.props
    const { page } = this.state

    return (
      <table>
        <thead>
          <tr>
            {columns.map(column => (
              <th>{column}</th>
            ))}
          </tr>
        </thead>

        {range(page + 1).map(i => (
          <TablePage
            key={i}
            observe={this.observe}
            pageNumber={i}
            fetchData={fetchData}
            unObserve={this.unObserve}
          />
        ))}

        <LoadingRow
          pageNumber={page + 1}
          observe={this.observe}
          unObserve={this.unObserve}
        />
      </table>
    )
  }
}

export default Table
