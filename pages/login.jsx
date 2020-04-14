import React, { useRef, useEffect } from 'react'
import { withRouter } from 'next/router'

import styles from './login.css'

const { IDP_URL } = process.env
const FORBIDDEN_REDIRECT_URL = 'https://dashboard.core.ac.uk'

const Login = React.memo(({ router, fetchUser }) => {
  const loginIframeRef = useRef(null)
  const searchParams = {
    reason: router.query.reason === 'logout' ? 'logout' : '',
    identity_provider_url: IDP_URL,
  }

  const search = new URLSearchParams(searchParams).toString()

  const handlePostMessage = async (event) => {
    if (event.data === 'login-processing') {
      try {
        await fetchUser()
        router.push('/')
      } catch (error) {
        if (loginIframeRef.current) {
          loginIframeRef.current.contentWindow.postMessage(
            'login-finished',
            window.location.origin
          )
        }
      }
    } else if (event.data === 'login-fallback')
      window.location.replace(FORBIDDEN_REDIRECT_URL)
  }

  useEffect(() => {
    window.addEventListener('message', handlePostMessage)
    return () => window.removeEventListener('message', handlePostMessage)
  }, [])

  const url = `/login.html?${search}`
  return (
    <iframe
      ref={loginIframeRef}
      title="Login Form"
      src={url}
      className={styles.loginIframe}
    />
  )
})

export default withRouter(Login)
