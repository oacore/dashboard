import React from 'react'

import styles from './logout.module.css'

import { AppBar, Dropdown } from 'design'
import { withGlobalStore } from 'store'

const { IDP_URL } = process.env

const getLogoutUrl = (pathname) => {
  const url = new URL('./logout', IDP_URL)
  if (pathname != null) url.searchParams.set('continue', pathname)
  return url
}

const Logout = ({ store }) => {
  if (!store.user) return null
  const name = store.user.name || store.user.email
  const redirectUrl =
    typeof window != 'undefined'
      ? `${window.location.origin}/login?reason=logout`
      : null

  return (
    <AppBar.Item className={styles.container}>
      <Dropdown>
        <Dropdown.Toggle className={styles.name}>{name}</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item>
            <a href={getLogoutUrl(redirectUrl)}>Logout</a>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </AppBar.Item>
  )
}

export default withGlobalStore(Logout)
