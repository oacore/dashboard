import React from 'react'

import styles from './styles.module.css'

import { IframeForm } from 'components/forms'
import { Card } from 'design'
import { withGlobalStore } from 'store'

const { IDP_URL } = process.env

const ChangePassword = ({ className, store, tag }) => {
  const email = store.user?.email
  const searchParams = {
    ...(email != null ? { email } : {}),
    identity_provider_url: IDP_URL,
  }

  const search = new URLSearchParams(searchParams).toString()

  return (
    <Card className={className} tag={tag}>
      <h2>Change password</h2>
      <IframeForm
        className={styles.changePasswordIframe}
        title="Password change form"
        src={`/secure/reset.html?${search}`}
      />
    </Card>
  )
}

export default withGlobalStore(ChangePassword)
