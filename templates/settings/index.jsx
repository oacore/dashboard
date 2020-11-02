import React, { useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'

import { Card, TextField } from 'design'
import { ChangePassword, FormShell } from 'components/forms'
import Title from 'components/title'

const SettingsTemplate = ({
  userEmail,
  dataProvider,
  updateOrganization,
  updateDataProvider,
  inviteUser,
  className,
  tag: Tag = 'main',
  ...restProps
}) => {
  const [formMessage, setFormMessage] = useState({})
  const organization = { name: dataProvider.institution }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData.entries())

    const scope = event.target.getAttribute('name')
    const present = {
      'organization': updateOrganization,
      'data-provider': updateDataProvider,
      'invitation': inviteUser,
    }[scope]

    const result = await present(data)

    setFormMessage({
      ...formMessage,
      [scope]: result.message,
    })
  }

  return (
    <Tag className={classNames.use(styles.container, className)} {...restProps}>
      <Title>Settings</Title>
      <Card
        className={classNames.use(styles.section).join(className)}
        tag="section"
      >
        <Card.Title tag="h2">Organisation settings</Card.Title>
        <FormShell
          name="organization"
          onSubmit={handleSubmit}
          message={formMessage.organization}
        >
          <TextField
            id="settings-global-email"
            label="Name"
            name="name"
            defaultValue={organization.name}
            tag="p"
          />
        </FormShell>
        <h2>Invite</h2>
        <FormShell
          className={styles.invitationForm}
          name="invitation"
          buttonCaption="Invite"
          isButtonVisible
          onSubmit={handleSubmit}
          message={formMessage.invitation}
        >
          <TextField
            id="settings-invitation"
            size="small"
            label="Email"
            name="email"
            tag="div"
          />
        </FormShell>
      </Card>

      <Card
        className={classNames.use(styles.section).join(className)}
        tag="section"
      >
        <Card.Title tag="h2">Repository settings</Card.Title>
        <FormShell
          name="data-provider"
          onSubmit={handleSubmit}
          message={formMessage['data-provider']}
        >
          <TextField
            id="settings-repository-name"
            label="Name"
            name="name"
            defaultValue={dataProvider.name}
            tag="p"
          />
          <TextField
            id="settings-repository-email"
            label="Email"
            name="email"
            defaultValue={dataProvider.email}
            tag="p"
            readOnly
          />
        </FormShell>
      </Card>

      <ChangePassword
        className={styles.section}
        email={userEmail}
        tag="section"
      />
    </Tag>
  )
}

export default SettingsTemplate
