import React, { useState, useEffect } from 'react'

import { Button } from 'design'

const FormShell = ({
  children,
  tag,
  onSubmit,
  useButtonOnChange = true,
  isButtonVisible = false,
  buttonCaption = 'Save',
  message,
  ...formProps
}) => {
  const [isChanged, setChanged] = useState(false)
  const [isSubmitted, setSubmitted] = useState(false)

  const handleChange = () => {
    setChanged(true)
  }

  const handleSubmit = (event) => {
    setSubmitted(true)
    if (onSubmit) onSubmit(event)
    event.target.reset()
  }

  useEffect(() => {
    setChanged(false)
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
      {((useButtonOnChange && isChanged) || isButtonVisible) && (
        <Button variant="contained" disabled={isSubmitted}>
          {buttonCaption}
        </Button>
      )}
      {message && (!isChanged || isButtonVisible) && <p>{message}</p>}
    </form>
  )
}

export default FormShell
