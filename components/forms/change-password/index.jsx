import React from 'react'

import styles from './styles.module.css'

import { IframeForm } from 'components/forms'
import { Card } from 'design'

const ChangePassword = ({ className, email, token, tag }) => {
  const searchParams = {
    ...(email != null ? { email } : {}),
    ...(token != null ? { token } : {}),
    identity_provider_url: process.env.IDP_URL,
  }

  const search = new URLSearchParams(searchParams).toString()

  return (
    <Card className={className} tag={tag}>
      {email ? (
        <Card.Title tag="h2">
          Change password for <span className={styles.email}>{email}</span>
        </Card.Title>
      ) : (
        <Card.Title tag="h2">Reset password</Card.Title>
      )}

      <IframeForm
        id="reset-password-form"
        className={styles.changePasswordIframe}
        title="Password change form"
        src={`/secure/reset.html?${search}`}
      />
    </Card>
  )
}

export default ChangePassword
