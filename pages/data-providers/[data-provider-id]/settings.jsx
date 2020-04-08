import React, { useState, useEffect } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './settings.css'

import { Card, TextField, Button } from 'design'
import { withGlobalStore } from 'store'
import { ChangePassword } from 'components/forms'

const SettingsGroup = ({
  children,
  className,
  tag,
  onSubmit,
  ...formProps
}) => {
  const [isChanged, setChanged] = useState(false)
  const [isSubmitted, setSubmitted] = useState(false)

  const handleChange = () => setChanged(true)

  const handleSubmit = (event) => {
    setSubmitted(true)
    if (onSubmit) onSubmit(event)
  }

  useEffect(() => {
    setChanged(false)
    setSubmitted(false)
  }, [children])

  return (
    <Card className={classNames.use(styles.section).join(className)} tag={tag}>
      <form
        method="post"
        onChange={handleChange}
        onSubmit={handleSubmit}
        {...formProps}
      >
        {children}
        {isChanged && (
          <Button variant="contained" disabled={isSubmitted}>
            Save
          </Button>
        )}
      </form>
    </Card>
  )
}

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
      <SettingsGroup name="organization" onSubmit={handleSubmit} tag="section">
        <h2>Organisation settings</h2>
        <TextField
          label="Name"
          name="name"
          defaultValue={organization.name}
          tag="p"
        />
      </SettingsGroup>

      <SettingsGroup name="data-provider" onSubmit={handleSubmit} tag="section">
        <h2>Repository settings</h2>
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
      </SettingsGroup>

      <ChangePassword className={styles.section} tag="section" />
    </main>
  )
}

export default withGlobalStore(Settings)
