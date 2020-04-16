import React, { useRef, useEffect, useCallback } from 'react'
import { withRouter } from 'next/router'

import styles from './login.css'

import { Card } from 'design'

const { IDP_URL } = process.env

const Login = React.memo(({ router }) => {
  const loginIframeRef = useRef(null)
  const searchParams = {
    reason: router.query.reason === 'logout' ? 'logout' : '',
    identity_provider_url: IDP_URL,
  }

  const search = new URLSearchParams(searchParams).toString()

  const resize = useCallback(() => {
    loginIframeRef.current.style.height = `${loginIframeRef.current.contentWindow.document.body.offsetHeight}px`
  }, [])

  useEffect(() => {
    const observer = new ResizeObserver(resize)
    observer.observe(loginIframeRef.current.contentWindow.document.body)
    return () => observer.disconnect()
  }, [])

  const url = `/secure/login.html?${search}`
  return (
    <Card className={styles.loginIframeContainer}>
      <iframe
        ref={loginIframeRef}
        title="Login Form"
        src={url}
        onLoad={resize}
      />
    </Card>
  )
})

export default withRouter(Login)
