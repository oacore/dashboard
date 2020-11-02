import React, { useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'

import { Card, TextField, Button } from 'design'
import { withGlobalStore } from 'store'
import Title from 'components/title'

const ResetPassword = ({ className, store, ...restProps }) => {
  const [message, setMessage] = useState(null)

  // TODO: Better texts and move it to @oacore/texts
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const formData = new FormData(event.target)
      const data = {
        email: formData.get('email'),
      }
      await store.requestResetToken(data)
      setMessage('Please check your mailbox with the following instructions.')
    } catch (error) {
      setMessage('Something went wrong. Please try it again!')
    }
    return false
  }

  return (
    <Card
      className={classNames.use(styles.resetContainer, className)}
      {...restProps}
    >
      <Title hidden>Password reset</Title>
      <form onSubmit={handleSubmit}>
        <h2>Reset password</h2>
        <TextField
          id="reset-email"
          label="Email"
          name="email"
          tag="p"
          required
        />
        <Button variant="contained">Continue</Button>
        {message && <p>{message}</p>}
      </form>
    </Card>
  )
}

export default withGlobalStore(ResetPassword)
