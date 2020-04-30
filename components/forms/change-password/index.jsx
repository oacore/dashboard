import React from 'react'

import styles from './styles.module.css'

import { IframeForm } from 'components/forms'
import { Card } from 'design'

const { IDP_URL } = process.env

const ChangePassword = ({ className, email, token, tag }) => {
  const searchParams = {
    ...(email != null ? { email } : {}),
    ...(token != null ? { token } : {}),
    identity_provider_url: IDP_URL,
  }

  const search = new URLSearchParams(searchParams).toString()

  return (
    <Card className={className} tag={tag}>
      <h2>{email ? 'Change password' : 'Reset password'}</h2>
      <IframeForm
        className={styles.changePasswordIframe}
        title="Password change form"
        src={`/secure/reset.html?${search}`}
      />
    </Card>
  )
}

export default ChangePassword
