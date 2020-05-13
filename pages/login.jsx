import React from 'react'
import { withRouter } from 'next/router'

import styles from './login.module.css'
import Title from '../components/title'

import { IframeForm } from 'components/forms'

const { IDP_URL } = process.env

const Login = React.memo(({ router }) => {
  const searchParams = {
    reason: router.query.reason,
    identity_provider_url: IDP_URL,
  }

  const search = new URLSearchParams(searchParams).toString()

  const url = `/secure/login.html?${search}`
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

export default withRouter(Login)
