import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import styles from './login.module.css'
import Title from '../components/title'

import { IframeForm } from 'components/forms'

const { IDP_URL } = process.env

const Login = React.memo(() => {
  const router = useRouter()
  const [url, setUrl] = useState(null)

  useEffect(() => {
    const searchParams = new URLSearchParams({
      reason: router.query.reason,
      identity_provider_url: IDP_URL,
    })

    try {
      if (!router.query.continue) throw new Error('No continue param present')
      const redirect = new URL(router.query.continue, window.location.origin)
      if (
        `${redirect.origin}${redirect.pathname}` ===
        `${window.location.origin}${window.location.pathname}`
      )
        throw new Error('Trying to redirect to the current page')
      searchParams.set('continue', redirect.toString())
    } catch (continueMalformedError) {
      searchParams.set('continue', '/')
    }

    setUrl(`/secure/login.html?${searchParams}`)
  }, [router.query.reason, router.query.continue])

  if (!url) return null

  return (
    <>
      <Title hidden>Login</Title>
      <IframeForm
        className={styles.loginIframeContainer}
        title="Login Form"
        src={url}
      />
    </>
  )
})

export default Login
