import React, { useEffect, useRef } from 'react'
import { TableBody, TableRow } from '@oacore/design'

const LoadingRow = React.memo(({ pageNumber, observe, unObserve }) => {
  const componentRef = useRef(null)

  useEffect(() => {
    observe(componentRef.current)
    return () => componentRef && unObserve(componentRef.current)
  }, [])

  return (
    <TableBody ref={componentRef} pagenumber={pageNumber}>
      <TableRow>IsLoading</TableRow>
    </TableBody>
  )
})

export default LoadingRow
