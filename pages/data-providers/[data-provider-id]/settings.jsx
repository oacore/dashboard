import React, { useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './settings.module.css'

import { Card, TextField } from 'design'
import { withGlobalStore } from 'store'
import { ChangePassword, FormShell } from 'components/forms'
import Title from 'components/title'

const Settings = ({ store, className, ...restProps }) => {
  const [formMessage, setFormMessage] = useState({})
  const { dataProvider } = store
  const organization = { name: dataProvider.institution }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData.entries())

    const scope = event.target.getAttribute('name')
    const present = {
      'organization': store.updateOrganization,
      'data-provider': store.updateDataProvider,
      'invitation': store.organisation.inviteUser,
    }[scope]

    const result = await present.call(store, data)
    setFormMessage({
      ...formMessage,
      [scope]: result.message,
    })
  }

  return (
    <main
      className={classNames.use(styles.container, className)}
      {...restProps}
    >
      <Title>Settings</Title>
      <Card
        className={classNames.use(styles.section).join(className)}
        tag="section"
      >
        <Card.Title tag="h2">Organisation settings</Card.Title>
        <FormShell name="organization" onSubmit={handleSubmit}>
          <TextField
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
          <TextField size="small" label="Email" name="email" tag="div" />
        </FormShell>
      </Card>

      <Card
        className={classNames.use(styles.section).join(className)}
        tag="section"
      >
        <Card.Title tag="h2">Repository settings</Card.Title>
        <FormShell name="data-provider" onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            defaultValue={dataProvider.name}
            tag="p"
          />
          <TextField
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
        email={store.user.email}
        tag="section"
      />
    </main>
  )
}

export default withGlobalStore(Settings)
