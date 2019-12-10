import React, { useEffect, useRef } from 'react'

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
    <tbody
      id={`section-${pageNumber}`}
      ref={componentRef}
      pageNumber={pageNumber}
    >
      {data.map(row => {
        return (
          <tr key={row.id}>
            {Object.values(row).map(cell => {
              return <td>{cell}</td>
            })}
          </tr>
        )
      })}
    </tbody>
  )
})

export default TablePage
