import React from 'react'
import { AppBar } from '@oacore/design'

import { API_URL } from '../../config'
import styles from './logout.css'

import { withGlobalStore } from 'store'

const LOGOUT_URL = `${API_URL.replace(
  '/internal',
  ''
)}/logout?continue=${encodeURIComponent(
  typeof window !== 'undefined'
    ? `${window.location.origin}/?reason=logout`
    : ''
)}`

const Logout = ({ store }) => {
  if (!store.user) return null
  const name = store.user.email

  return (
    <AppBar.Item className={styles.container}>
      <span className={styles.name}>{name}</span>{' '}
      <a href={LOGOUT_URL}>Logout</a>
    </AppBar.Item>
  )
}

export default withGlobalStore(Logout)
