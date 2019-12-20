import React, { useEffect, useRef, useReducer } from 'react'
import { Table } from '@oacore/design'

import TableRow from './TableRow'
import TableRowExpanded from './TableRowExpanded'

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
  }) => {
    const [rowsInfo, dispatch] = useReducer(reducer, {})
    const componentRef = useRef(null)
    const [data, setData] = React.useState([])

    useEffect(() => {
      const loadData = async () => {
        if (!data.length) {
          const rows = await fetchData()
          setData(rows)
        }
      }

      loadData()
    }, [])

    const rowPops = row => ({
      id: row.id,
      handleClick: () => dispatch({ type: 'toggle_expand_row', id: row.id }),
      handleSelect: () => dispatch({ type: 'toggle_select_row', id: row.id }),
      selectable,
      isSelected:
        areSelectedAll || (rowsInfo[row.id] && rowsInfo[row.id].selected),
      content: row,
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
          const props = rowPops(row)
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
