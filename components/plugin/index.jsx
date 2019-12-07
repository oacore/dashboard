import React, { useState } from 'react'

import pluginClassNames from './index.css'

const Plugin = ({ name, abstract, description }) => {
  const [isOpen, toggleOpen] = useState(false)

  // eslint-disable-next-line max-len
  /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus */
  return (
    <div
      role="button"
      onClick={() => toggleOpen(!isOpen)}
      className={pluginClassNames.plugin}
    >
      <h2>{name}</h2>
      <p>{isOpen ? description : abstract}</p>
      <button type="button">ENABLE</button>
    </div>
  )
  // eslint-disable-next-line max-len
  /* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus */
}

export default Plugin
