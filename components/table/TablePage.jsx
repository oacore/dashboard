import React, { useEffect, useRef } from 'react'
import { TableBody, TableRow, TableCell } from '@oacore/design'

const TablePage = React.memo(({ pageNumber, fetchData }) => {
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

  return (
    <TableBody
      id={`section-${pageNumber}`}
      ref={componentRef}
      pageNumber={pageNumber}
    >
      {data.map(row => {
        return (
          <TableRow key={row.id}>
            {Object.values(row).map(cell => {
              return <TableCell>{cell}</TableCell>
            })}
          </TableRow>
        )
      })}
    </TableBody>
  )
})

export default TablePage
