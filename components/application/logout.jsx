import React from 'react'
import { AppBar } from '@oacore/design'

import styles from './logout.module.css'

import { withGlobalStore } from 'store'

const getLogoutUrl = (pathname) => {
  const url = new URL('./logout', process.env.IDP_URL)
  if (pathname != null) url.searchParams.set('continue', pathname)
  return url
}

const Logout = ({ store }) => {
  if (!store.user) return null

  const renderName = () => {
    const name = store.user.name || store.user.email
    if (name === 'Anonymous') return store.user.email

    return store.user.name
  }

  const redirectUrl =
    typeof window != 'undefined'
      ? `${window.location.origin}/login?reason=logout`
      : null

  return (
    <AppBar.Item className={styles.container}>
      <span className={styles.name} title={renderName()}>
        {renderName()}
      </span>{' '}
      <a href={getLogoutUrl(redirectUrl)}>Logout</a>
    </AppBar.Item>
  )
}

export default withGlobalStore(Logout)
