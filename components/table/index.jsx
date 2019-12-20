import React from 'react'
import { Table, TextField } from '@oacore/design'

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
    const {
      config,
      selectable,
      searchable,
      expandable,
      title,
      className,
    } = this.props
    const { page, areSelectedAll, searchTerm } = this.state

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
        <Table className={className}>
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
                <Table.Cell key={column.id}>{column.display}</Table.Cell>
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
