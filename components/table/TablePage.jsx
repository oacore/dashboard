import React, { useEffect, useRef, useState } from 'react'
import { TableBody, TableRow, TableCell } from '@oacore/design'

import tableClassNames from './index.css'

const TablePage = React.memo(
  ({
    pageNumber,
    fetchData,
    columnRenderers,
    selectable,
    areSelectedAll,
    toggleSelectAll,
  }) => {
    const [rowsInfo, setRowsInfo] = useState({})
    const componentRef = useRef(null)
    const [data, setData] = React.useState([])

    const cellRenderer = (cellId, cellValue) => {
      if (columnRenderers[cellId]) return columnRenderers[cellId](cellValue)

      return cellValue
    }

    useEffect(() => {
      const loadData = async () => {
        if (!data.length) {
          const rows = await fetchData()
          setData(rows)
        }
      }

      loadData()
    }, [])

    return (
      <TableBody
        id={`section-${pageNumber}`}
        ref={componentRef}
        pagenumber={pageNumber}
      >
        {data.map(row => {
          return (
            <TableRow key={row.oai}>
              {selectable && (
                <TableCell className={tableClassNames.tableSelect}>
                  <input
                    type="checkbox"
                    checked={areSelectedAll || rowsInfo[row.oai]}
                    onChange={() => {
                      if (areSelectedAll) {
                        setRowsInfo({
                          [row.oai]: true,
                        })
                        toggleSelectAll()
                      } else {
                        setRowsInfo({
                          ...rowsInfo,
                          [row.oai]: !rowsInfo[row.oai],
                        })
                      }
                    }}
                  />
                </TableCell>
              )}
              {Object.entries(row).map(([cellId, cellValue]) => {
                return (
                  <TableCell key={`${pageNumber}-${cellId}`}>
                    {cellRenderer(cellId, cellValue)}
                  </TableCell>
                )
              })}
            </TableRow>
          )
        })}
      </TableBody>
    )
  }
)

export default TablePage
