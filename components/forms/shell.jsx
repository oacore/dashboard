import React, { useState, useEffect } from 'react'

import { Button } from 'design'

const FormShell = ({ children, className, tag, onSubmit, ...formProps }) => {
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
  )
}

export default FormShell
