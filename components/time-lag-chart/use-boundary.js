import { useEffect, useRef, useCallback } from 'react'

import { COMPLIANCE_LIMIT } from './data'

const useBoundaryScrollHandler = (options = {}) => {
  const {
    initialShift, // index of the column 0, initial shift
    barCount = COMPLIANCE_LIMIT,
    barWidth = 4,
    gutterWidth = 2,
  } = options

  const deps = [initialShift, barCount, barWidth, gutterWidth]
  const callback = useCallback((element) => {
    const { clientWidth } = element
    const barVisibleCount = Math.floor(
      (clientWidth + gutterWidth) / (barWidth + gutterWidth)
    )

    const startBarIndex =
      barVisibleCount > barCount
        ? initialShift - Math.floor((barVisibleCount - barCount) / 2)
        : initialShift
    const scrollPosition =
      barWidth * (startBarIndex - 1) + gutterWidth * (startBarIndex - 1)

    element.scroll(scrollPosition, 0)
  }, deps)

  return callback
}

const useBoundaryHandler = (elementRef, options) => {
  const observerRef = useRef(null)

  const handle = useBoundaryScrollHandler(options)

  const dispose = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect()
    observerRef.current = null
  }, [observerRef])

  useEffect(() => {
    dispose()

    const element = elementRef.current
    const observer = new ResizeObserver(([{ target }]) => handle(target))
    observer.observe(element)
    observerRef.current = observer

    return dispose
  }, [elementRef, handle])

  return dispose
}

const useBoundary = (ref, options) => {
  const disposeBoundary = useBoundaryHandler(ref, options)

  // Do not sync scroll with 0 bar if user already scrolled
  const enableControl = useRef(true)
  const scrollDisposer = useCallback((event) => {
    if (Math.abs(event.deltaX) < Math.abs(event.deltaY)) return

    enableControl.current = false
    disposeBoundary()
  }, [])

  return scrollDisposer
}

export default useBoundary
