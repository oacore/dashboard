import React, { useEffect, useCallback, useRef } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

import styles from './styles.module.css'

import { Card } from 'design'

const IframeForm = ({ className, title, ...passProps }) => {
  const ref = useRef(null)

  const resize = useCallback(() => {
    console.log('resize')
    ref.current.style.height = `${ref.current.contentWindow.document.body.offsetHeight}px`
  }, [])

  const observer = useRef(new ResizeObserver(resize))

  const handleOnLoad = useCallback(() => {
    console.log('handleOnLoad', ref.current)
    if (ref.current.contentWindow.document.body) {
      observer.current.unobserve(ref.current.contentWindow.document.body)
      observer.current.observe(ref.current.contentWindow.document.body)
      resize()
    }
  }, [])

  useEffect(() => {
    console.log('componentDidMount')
    // onLoad event may be fired before the JS is completely loaded
    // ensure the element gets observed
    // https://github.com/facebook/react/issues/15446
    handleOnLoad()
    return () => observer.current.disconnect()
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
