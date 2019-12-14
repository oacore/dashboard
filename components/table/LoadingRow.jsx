import React, { useEffect, useRef } from 'react'
import { TableBody, TableRow, TableCell } from '@oacore/design'

const LoadingRow = React.memo(({ pageNumber, observe, unObserve }) => {
  const componentRef = useRef(null)

  useEffect(() => {
    observe(componentRef.current)
    return () => componentRef && unObserve(componentRef.current)
  }, [])

  return (
    <TableBody ref={componentRef} pagenumber={pageNumber}>
      <TableRow>
        <TableCell colspan={1000}>IsLoading</TableCell>
      </TableRow>
    </TableBody>
  )
})

export default LoadingRow
