import React from 'react'
import { withRouter } from 'next/router'

import styles from './login.css'

const { IDP_URL } = process.env

const Login = React.memo(({ router }) => {
  const searchParams = {
    reason: router.query.reason === 'logout' ? 'logout' : '',
    identity_provider_url: IDP_URL,
  }

  const search = new URLSearchParams(searchParams).toString()

  const url = `/secure/login.html?${search}`
  return <iframe title="Login Form" src={url} className={styles.loginIframe} />
})

export default withRouter(Login)
