import React, { useEffect, useState } from 'react'

import styles from './styles.module.css'
import FormShell from '../shell'

import { TextField, Switch, useSwitch, Form } from 'design'
import content from 'texts/settings'

const ResolverSettingsForm = ({ oaiMapping, onSubmit, formMessage }) => {
  const { activated, urlMapping } = oaiMapping
  const [urlValue, setUrlValue] = useState(urlMapping)
  const [checked, setChecked] = useSwitch(activated)

  const toggleResolving = (e) => {
    onSubmit(e)
    setChecked(e)
  }

  useEffect(() => {
    setUrlValue(urlMapping)
  }, [])

  return (
    <FormShell
      name="mapping"
      useButtonOnChange={false}
      isButtonVisible
      buttonCaption={content.mapping.buttonCaption}
      onSubmit={onSubmit}
      message={formMessage}
    >
      <div key={content.mapping.form[0].name}>
        <Form.Label
          className={styles.mappingLabel}
          htmlFor={content.mapping.form[0].name}
        >
          {content.mapping.form[0].title}
        </Form.Label>
        <TextField
          className={styles.mappingInput}
          id={content.mapping.form[0].name}
          label={
            !oaiMapping[content.mapping.form[0].name] &&
            content.mapping.form[0].label
          }
          name={content.mapping.form[0].name}
          defaultValue={oaiMapping[content.mapping.form[0].name]}
          helper={content.mapping.form[0].helper}
          statusIcon={!content.mapping.form[0].disabled ? '#pencil' : null}
          disabled={content.mapping.form[0].disabled}
        />
      </div>
      <div key={content.mapping.form[1].name}>
        <Form.Label
          className={styles.mappingLabel}
          htmlFor={content.mapping.form[1].name}
        >
          {content.mapping.form[1].title}
        </Form.Label>
        <TextField
          className={styles.mappingInput}
          id={content.mapping.form[1].name}
          label={
            !oaiMapping[content.mapping.form[1].name] &&
            content.mapping.form[1].label
          }
          name={content.mapping.form[1].name}
          value={urlValue}
          onChange={(e) => {
            setUrlValue(e.target.value)
          }}
          helper={content.mapping.form[1].helper}
          statusIcon={!content.mapping.form[1].disabled ? '#pencil' : null}
          disabled={content.mapping.form[1].disabled}
        />
      </div>
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
