import React, { useRef, useCallback, useEffect } from 'react'

import styles from './styles.css'

import { Card } from 'design'
import { withGlobalStore } from 'store'

const { IDP_URL } = process.env

const ChangePassword = ({ className, store, tag }) => {
  const iframeRef = useRef(null)
  const email = store.user?.email
  const searchParams = {
    ...(email != null ? { email } : {}),
    identity_provider_url: IDP_URL,
  }

  const search = new URLSearchParams(searchParams).toString()
  const resize = useCallback(() => {
    iframeRef.current.style.height = `${iframeRef.current.contentWindow.document.body.offsetHeight}px`
  })

  useEffect(() => {
    const observer = new ResizeObserver(resize)
    observer.observe(iframeRef.current.contentWindow.document.body)
    return () => observer.disconnect()
  }, [])

  return (
    <Card className={className} tag={tag}>
      <h2>Change password</h2>
      <iframe
        ref={iframeRef}
        className={styles.changePasswordIframe}
        title="Password change form"
        src={`/secure/reset.html?${search}`}
        onLoad={resize}
      />
    </Card>
  )
}

export default withGlobalStore(ChangePassword)
