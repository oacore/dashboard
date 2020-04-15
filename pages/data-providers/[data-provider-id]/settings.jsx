import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './settings.module.css'

import { Card, TextField } from 'design'
import { withGlobalStore } from 'store'
import { ChangePassword, FormShell } from 'components/forms'

const Settings = ({ store, className, ...restProps }) => {
  const { dataProvider } = store
  const organization = { name: dataProvider.institution }

  const handleSubmit = (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData.entries())

    const scope = event.target.getAttribute('name')
    const present = {
      'organization': store.updateOrganization,
      'data-provider': store.updateDataProvider,
    }[scope]

    present.call(store, data)
  }

  return (
    <main
      className={classNames.use(styles.container, className)}
      {...restProps}
    >
      <h1>Settings</h1>
      <Card
        className={classNames.use(styles.section).join(className)}
        tag="section"
      >
        <h2>Organisation settings</h2>
        <FormShell name="organization" onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            defaultValue={organization.name}
            tag="p"
          />
        </FormShell>
      </Card>

      <Card
        className={classNames.use(styles.section).join(className)}
        tag="section"
      >
        {' '}
        <h2>Repository settings</h2>
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
          />
        </FormShell>
      </Card>

      <ChangePassword className={styles.section} tag="section" />
    </main>
  )
}

export default withGlobalStore(Settings)
