import React from 'react'
import { AppBar } from '@oacore/design'

import styles from './logout.module.css'

import { withGlobalStore } from 'store'

const { IDP_URL } = process.env

const getLogoutUrl = (pathname) => {
  const url = new URL('./logout', IDP_URL)
  if (pathname != null) url.searchParams.set('continue', pathname)
  return url
}

const Logout = ({ store }) => {
  if (!store.user) return null
  const name = store.user.email
  const redirectUrl =
    typeof window != 'undefined'
      ? `${window.location.origin}/login?reason=logout`
      : null

  return (
    <AppBar.Item className={styles.container}>
      <span className={styles.name} title={name}>
        {name}
      </span>{' '}
      <a href={getLogoutUrl(redirectUrl)}>Logout</a>
    </AppBar.Item>
  )
}

export default withGlobalStore(Logout)
