import React from 'react'

import styles from './styles.module.css'
import FormShell from '../shell'

import { TextField, Switch, useSwitch, Form } from 'design'
import content from 'texts/settings'

const ResolverSettingsForm = ({ oaiMapping, onSubmit, formMessage }) => {
  const { activated } = oaiMapping

  const [checked, setChecked] = useSwitch(activated)

  const toggleResolving = (e) => {
    onSubmit(e)
    setChecked(e)
  }

  return (
    <FormShell
      name="mapping"
      useButtonOnChange={false}
      isButtonVisible
      buttonCaption={content.mapping.buttonCaption}
      onSubmit={onSubmit}
      message={formMessage}
    >
      {content.mapping.form.map((field) => (
        <div key={field.name}>
          <Form.Label className={styles.mappingLabel} htmlFor={field.name}>
            {field.title}
          </Form.Label>
          <TextField
            className={styles.mappingInput}
            id={field.name}
            label={!oaiMapping[field.name] && field.label}
            name={field.name}
            defaultValue={oaiMapping[field.name]}
            helper={field.helper}
            statusIcon={!field.disabled ? '#pencil' : null}
            disabled={field.disabled}
          />
        </div>
      ))}
      <Switch
        className={styles.toggle}
        id="activated"
        checked={checked}
        onChange={toggleResolving}
        label={
          checked
            ? content.mapping.switch.active
            : content.mapping.switch.disabled
        }
      />
    </FormShell>
  )
}

export default ResolverSettingsForm
