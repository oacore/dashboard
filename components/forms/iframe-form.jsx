import React, { useEffect, useCallback, useRef } from 'react'

import { Card } from '../../design'
import styles from './styles.module.css'

const IframeForm = ({ className, title, ...passProps }) => {
  const ref = useRef(null)
  const resize = useCallback(() => {
    ref.current.style.height = `${ref.current.contentWindow.document.body.offsetHeight}px`
  }, [])

  useEffect(() => {
    if (ref.current === null) return () => {}

    const observer = new ResizeObserver(resize)
    observer.observe(ref.current.contentWindow.document.body)
    return () => observer.disconnect()
  }, [ref.current])

  return (
    <Card className={className}>
      <iframe
        ref={ref}
        className={styles.iframeForm}
        title={title}
        onLoad={resize}
        {...passProps}
      />
    </Card>
  )
}

export default IframeForm
