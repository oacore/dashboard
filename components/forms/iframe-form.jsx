import React, { useEffect, useCallback, useRef } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

import styles from './styles.module.css'

import { Card } from 'design'

const IframeForm = ({ className, title, ...passProps }) => {
  const ref = useRef(null)
  const observer = useRef(null)

  const resize = useCallback(() => {
    ref.current.style.height = `${ref.current.contentWindow.document.body.offsetHeight}px`
  }, [])

  useEffect(() => {
    observer.current = new ResizeObserver(resize)
    return () => observer.current.disconnect()
  }, [])

  const handleOnLoad = useCallback(() => {
    observer.current.observe(ref.current.contentWindow.document.body)
    resize()
  }, [])

  return (
    <Card className={className}>
      <iframe
        ref={ref}
        className={styles.iframeForm}
        title={title}
        onLoad={handleOnLoad}
        {...passProps}
      />
    </Card>
  )
}

export default IframeForm
