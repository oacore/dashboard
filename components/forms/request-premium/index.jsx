import React, { useState, useCallback } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'

import { Button, TextField } from 'design'

// TODO: Should be moved to @oacore/design
const Textarea = ({
  id,
  className,
  label,
  tag: Tag = 'p',
  ...textareaProps
}) => (
  <Tag id={id} className={classNames.use(styles.textarea).join(className)}>
    <textarea id={`${id}-textarea`} {...textareaProps} />
    <label htmlFor={`${id}-textarea`}>{label}</label>
  </Tag>
)

const Form = ({
  // data props
  fromEmail,
  fromName,
  subject,
  body,
  product,

  // html props
  children,
  className,
  ...formProps
}) => {
  // Showing name only when email is edited
  const [showName, toggleName] = useState(false)

  // Showing message only when user decided to edit it
  const [showMessage, toggleMessage] = useState(false)

  const handleMessageToggle = useCallback(() => toggleMessage(true), [])

  return (
    <form
      className={classNames.use(styles.container).join(className)}
      {...formProps}
    >
      <div className={styles.personal}>
        <TextField
          type="email"
          name="email"
          defaultValue={fromEmail}
          autoComplete="email"
          label="Email"
          helper="We will get back to you using the above email address"
          onChange={useCallback(() => toggleName(true), [])}
          tag="p"
        />
        {showName ? (
          <TextField
            name="name"
            defaultValue={fromName}
            autoComplete="name"
            label="Name"
            tag="p"
          />
        ) : (
          <p>
            <input type="hidden" name="name" value={fromName} />
          </p>
        )}
      </div>

      <input type="hidden" name="subject" value={subject} />

      {showMessage ? (
        <Textarea id="body" name="body" label="Message" defaultValue={body} />
      ) : (
        <p>
          <input type="hidden" name="body" defaultValue={body} />
          <Button
            variant="outlined"
            type="button"
            onClick={handleMessageToggle}
          >
            Customise message
          </Button>
        </p>
      )}

      <input type="hidden" name="product" value={product} />

      {children}
    </form>
  )
}

export default Form
