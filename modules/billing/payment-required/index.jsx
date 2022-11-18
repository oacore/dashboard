import React, { useState, useCallback } from 'react'

import data, { useFormAction, useFormContext, useSync } from './data'

import { Button } from 'design'
// import Markdown from 'components/markdown'
import Form from 'components/forms/request-premium'
import { withGlobalStore } from 'store'

const getStatusText = (status) => {
  if (status === 'success') return 'Sent successfully'
  if (status === 'failure') return 'An error happened. Please try again'
  return ''
}

const FormController = ({ onSent, onCancel, ...formProps }) => {
  // editing, sending, success, failure
  const [status, changeStatus] = useState('editing')

  const formContext = useFormContext()
  const [action, send] = useFormAction()

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()
      const rawUserInput = new FormData(event.target)
      const { body, ...metadata } = Object.fromEntries(rawUserInput.entries())
      const message = {
        ...metadata,
        message: body,
      }

      changeStatus('sending')
      send(message).then(
        (success) => {
          changeStatus(success ? 'success' : 'failure')
          if (typeof onSent == 'function' && success) onSent(message)
        },
        () => {
          changeStatus('failure')
        }
      )
    },
    [send]
  )

  // Populate changes on blur only to prevent live editing in two places
  const handleChange = useCallback((event) => {
    const { name, value } = event.target
    data.update({ [name]: value })
  }, [])

  return (
    <Form
      action={action}
      method="post"
      {...formContext}
      onSubmit={handleSubmit}
      onBlur={handleChange}
      {...formProps}
    >
      <Button
        variant="contained"
        disabled={status !== 'editing' && status !== 'failure'}
      >
        Send
      </Button>{' '}
      {getStatusText(status)}
    </Form>
  )
}

const PaymentRequiredNote = ({ store, children, variant = 'button' }) => {
  const [formShown, toggleForm] = useState(variant === 'form')
  const [requestSent, toggleSent] = useState(false)
  const handleToggle = useCallback(() => toggleForm(!formShown), [formShown])
  const handleSend = useCallback(() => {
    toggleForm(false)
    toggleSent(true)
  }, [])
  // TODO Need agree a new text
  // const context = useNoteContext()
  // {template && <Markdown>{template.render(context)}</Markdown>}

  useSync(store)

  return (
    <>
      {children}
      <p hidden={formShown} style={{ marginBottom: 0 }}>
        <Button
          variant="contained"
          type="button"
          onClick={handleToggle}
          disabled={requestSent}
        >
          Register interest
        </Button>{' '}
        {requestSent && getStatusText('success')}
      </p>
      <FormController
        hidden={!formShown}
        onSent={handleSend}
        onCancel={handleToggle}
      />
    </>
  )
}

export default withGlobalStore(PaymentRequiredNote)
