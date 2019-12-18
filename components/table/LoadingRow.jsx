import React, { useEffect, useRef } from 'react'
import { Table } from '@oacore/design'

const LoadingRow = React.memo(({ pageNumber, observe, unObserve }) => {
  const componentRef = useRef(null)

  useEffect(() => {
    observe(componentRef.current)
    return () => unObserve(componentRef.current)
  }, [])

  return (
    <Table.Body ref={componentRef} pagenumber={pageNumber}>
      <Table.Row>
        <Table.Cell colSpan={1000}>IsLoading</Table.Cell>
      </Table.Row>
    </Table.Body>
  )
})

export default LoadingRow
