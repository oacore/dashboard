import React, { useState, useEffect } from 'react'

import { Button } from 'design'

const FormShell = ({
  children,
  tag,
  onSubmit,
  isButtonVisible = false,
  buttonCaption = 'Save',
  message,
  ...formProps
}) => {
  const [isChanged, setChanged] = useState(isButtonVisible)
  const [isSubmitted, setSubmitted] = useState(false)

  const handleChange = () => setChanged(true)

  const handleSubmit = (event) => {
    setSubmitted(true)
    if (onSubmit) onSubmit(event)
  }

  useEffect(() => {
    if (!isButtonVisible) setChanged(false)
    setSubmitted(false)
  }, [children])

  return (
    <form
      method="post"
      onChange={handleChange}
      onSubmit={handleSubmit}
      {...formProps}
    >
      {children}
      {isChanged && (
        <Button variant="contained" disabled={isSubmitted}>
          {buttonCaption}
        </Button>
      )}
      {message && <p>{message}</p>}
    </form>
  )
}

export default FormShell
