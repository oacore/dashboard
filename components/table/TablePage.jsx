import React, { useEffect, useRef } from 'react'
import { TableBody, TableRow, TableCell } from '@oacore/design'

const TablePage = React.memo(({ pageNumber, fetchData, columnRenderers }) => {
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
      pageNumber={pageNumber}
    >
      {data.map(row => {
        return (
          <TableRow key={row.id}>
            {Object.entries(row).map(([cellId, cellValue]) => {
              return <TableCell>{cellRenderer(cellId, cellValue)}</TableCell>
            })}
          </TableRow>
        )
      })}
    </TableBody>
  )
})

export default TablePage
