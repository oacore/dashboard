import React, { useEffect, useRef, useReducer } from 'react'
import { Table } from '@oacore/design'

import TableRow from './TableRow'
import TableRowExpanded from './TableRowExpanded'

import { makeCancelable } from 'utils/promise'

const reducer = (state, action) => {
  switch (action.type) {
    case 'toggle_select_row':
      return {
        ...state,
        [action.id]: {
          selected: !(state[action.id] && state[action.id].selected),
          expanded: state[action.id] && state[action.id].expanded,
        },
      }
    case 'toggle_expand_row':
      return {
        ...state,
        [action.id]: {
          selected: state[action.id] && state[action.id].selected,
          expanded: !(state[action.id] && state[action.id].expanded),
        },
      }
    default:
      return state
  }
}

const TablePage = React.memo(
  ({
    pageNumber,
    fetchData,
    config,
    selectable,
    areSelectedAll,
    expandable,
    columnOrder,
    searchTerm,
  }) => {
    const [rowsInfo, dispatch] = useReducer(reducer, {})
    const componentRef = useRef(null)
    const fetchDataPromise = useRef(null)
    const [data, setData] = React.useState([])

    // cancel pending request on componentDidUnmount
    useEffect(
      () => () => fetchDataPromise.current && fetchDataPromise.current.cancel(),
      []
    )

    useEffect(() => {
      const loadData = async () => {
        if (fetchData.current) fetchData.current.cancel()
        const newFetchDataPromise = fetchData(
          pageNumber,
          columnOrder,
          searchTerm
        )
        fetchDataPromise.current = makeCancelable(newFetchDataPromise.promise, {
          cancel: newFetchDataPromise.cancel,
        })
        try {
          const rows = await fetchDataPromise.current.promise
          setData(rows)
        } catch (error) {
          // silently ignores abort error
          const { status } = error
          if (status !== null) throw error
        } finally {
          fetchDataPromise.current = null
        }
      }
      loadData()
      return () => fetchDataPromise.current && fetchDataPromise.current.cancel()
    }, [columnOrder, searchTerm])

    const rowProps = row => ({
      id: row.id,
      handleClick: () => dispatch({ type: 'toggle_expand_row', id: row.id }),
      handleSelect: () => dispatch({ type: 'toggle_select_row', id: row.id }),
      selectable,
      isSelected:
        areSelectedAll || (rowsInfo[row.id] && rowsInfo[row.id].selected),
      content: { ...row, pageNumber },
      config,
      isExpanded: rowsInfo[row.id] && rowsInfo[row.id].expanded,
      expandable,
    })

    return (
      <Table.Body
        id={`section-${pageNumber}`}
        ref={componentRef}
        pagenumber={pageNumber}
      >
        {data.map(row => {
          const props = rowProps(row)
          return (
            <React.Fragment key={row.id}>
              <TableRow key={row.id} {...props} />
              {expandable && (
                <TableRowExpanded key={`${row.id}-expanded`} {...props} />
              )}
            </React.Fragment>
          )
        })}
      </Table.Body>
    )
  }
)

export default TablePage
