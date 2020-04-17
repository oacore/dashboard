import React, { useEffect, useRef, useState } from 'react'
import { Table } from '@oacore/design'

const LoadMoreRow = React.memo(({ onVisible, observe }) => {
  const [loadTriggered, setLoadTriggered] = useState(false)
  const componentRef = useRef(null)
  const isUnmounted = useRef(false)

  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return

        setLoadTriggered(true)
        onVisible().then(() => {
          if (!isUnmounted.current) setLoadTriggered(false)
        })
      },
      { threshold: 1, rootMargin: '20% 0px' }
    )
  )

  useEffect(() => {
    if (observe) observer.current.observe(componentRef.current)
    else observer.current.unobserve(componentRef.current)
    return () => observer.current.unobserve(componentRef.current)
  }, [observe])
  useEffect(
    () => () => {
      isUnmounted.current = true
    },
    []
  )

  return (
    <Table.Row ref={componentRef}>
      <Table.Cell colSpan={1000}>
        {loadTriggered && observe ? (
          <button type="button" onClick={onVisible}>
            Load more
          </button>
        ) : (
          'Loading data'
        )}
      </Table.Cell>
    </Table.Row>
  )
})

export default LoadMoreRow
