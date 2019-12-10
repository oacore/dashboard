import React, { useEffect, useRef } from 'react'

const LoadingRow = React.memo(({ pageNumber, observe, unObserve }) => {
  const componentRef = useRef(null)

  useEffect(() => {
    observe(componentRef.current)
    return () => componentRef && unObserve(componentRef.current)
  }, [])

  return (
    <tbody ref={componentRef} pagenumber={pageNumber}>
      <tr>IsLoading</tr>
    </tbody>
  )
})

export default LoadingRow
