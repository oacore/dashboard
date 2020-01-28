import React from 'react'
import { AppBar } from '@oacore/design'

import styles from './logout.css'

import { withGlobalStore } from 'store'

const LOGOUT_URL = `https://api.dev.core.ac.uk/logout?continue=${encodeURIComponent(
  typeof window !== 'undefined' ? `${window.location.origin}/logout.html` : ''
)}`

const Logout = ({ store }) => {
  const name =
    `${store.user.givenName} ${store.user.familyName}` || store.user.email

  return (
    <AppBar.Item className={styles.container}>
      <span className={styles.name}>{name}</span>{' '}
      <a href={LOGOUT_URL}>Logout</a>
    </AppBar.Item>
  )
}

export default withGlobalStore(Logout)
