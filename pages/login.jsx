import React from 'react'
import { useRouter } from 'next/router'

import styles from './login.module.css'
import Title from '../components/title'

import { IframeForm } from 'components/forms'

const { IDP_URL } = process.env

const Login = React.memo(() => {
  const router = useRouter()
  const searchParams = new URLSearchParams({
    reason: router.query.reason,
    identity_provider_url: IDP_URL,
  })

  if (router.query.continue) {
    try {
      const redirect = new URL(router.query.continue, window.location.origin)
      if (
        window.location.origin === redirect.origin &&
        !redirect.pathname.startsWith('/login')
      )
        searchParams.set('continue', redirect.toString())
    } catch (error) {
      // silently ignore wrong continue param
    }
  }

  const url = `/secure/login.html?${searchParams}`

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
