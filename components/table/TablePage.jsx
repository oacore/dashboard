import React, { useEffect, useRef, useReducer } from 'react'
import { Table } from '@oacore/design'

import TableRow from './TableRow'
import TableRowExpanded from './TableRowExpanded'

const reducer = (state, action) => {
  switch (action.type) {
    case 'toggle_select_row':
      return {
        ...state,
        [action.oai]: {
          selected: !(state[action.oai] && state[action.oai].selected),
          expanded: state[action.oai] && state[action.oai].expanded,
        },
      }
    case 'toggle_expand_row':
      return {
        ...state,
        [action.oai]: {
          selected: state[action.oai] && state[action.oai].selected,
          expanded: !(state[action.oai] && state[action.oai].expanded),
        },
      }
    default:
      return state
  }
}

const TablePage = React.memo(
  ({ pageNumber, fetchData, config, selectable, areSelectedAll, expandable }) => {
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
      id: row.oai,
      handleClick: () => dispatch({ type: 'toggle_expand_row', oai: row.oai }),
      handleSelect: () => dispatch({ type: 'toggle_select_row', oai: row.oai }),
      selectable,
      isSelected:
        areSelectedAll || (rowsInfo[row.oai] && rowsInfo[row.oai].selected),
      content: row,
      config,
      isExpanded: rowsInfo[row.oai] && rowsInfo[row.oai].expanded,
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
            <React.Fragment key={row.oai}>
              <TableRow key={row.oai} {...props} />
              {expandable && (
                <TableRowExpanded key={`${row.oai}-expanded`} {...props} />
              )}
            </React.Fragment>
          )
        })}
      </Table.Body>
    )
  }
)

export default TablePage
