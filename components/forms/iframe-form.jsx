import React, { useEffect, useCallback, useRef } from 'react'

import { Card } from '../../design'

const IframeForm = ({ className, title, ...passProps }) => {
  const ref = useRef(null)
  const resize = useCallback(() => {
    ref.current.style.height = `${ref.current.contentWindow.document.body.offsetHeight}px`
  }, [])

  useEffect(() => {
    const observer = new ResizeObserver(resize)
    observer.observe(ref.current.contentWindow.document.body)
    return () => observer.disconnect()
  }, [])

  return (
    <Card className={className}>
      <iframe ref={ref} title={title} onLoad={resize} {...passProps} />
    </Card>
  )
}

export default IframeForm
