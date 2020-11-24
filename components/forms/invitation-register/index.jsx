import React from 'react'

import IframeForm from '../iframe-form'
import styles from './styles.module.css'

import { Card } from 'design'

const { IDP_URL } = process.env

const InvitationRegister = ({ className, email, invitationCode, tag }) => {
  const searchParams = {
    ...(email != null ? { email } : {}),
    ...(invitationCode != null ? { invitationCode } : {}),
    identity_provider_url: IDP_URL,
  }

  const search = new URLSearchParams(searchParams).toString()

  return (
    <Card className={className} tag={tag}>
      <h2>Register</h2>
      <IframeForm
        id="invitation-form"
        className={styles.invitationRegisterIframe}
        title="Registration form"
        src={`/secure/invitation.html?${search}`}
      />
    </Card>
  )
}

export default InvitationRegister
