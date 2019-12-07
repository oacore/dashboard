import React, { useState } from 'react'

import { withGlobalStore } from '../../store'
import pluginClassNames from './index.css'

const Plugin = ({ name, abstract, description, store }) => {
  const [isOpen, toggleOpen] = useState(false)
  const plugin = store.plugins[name.toLowerCase()]

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
      <button
        onClick={event => {
          plugin.enabled = !plugin.enabled
          event.stopPropagation()
        }}
        type="button"
      >
        {plugin.enabled ? 'ENABLED' : 'DISABLED'}
      </button>
    </div>
  )
  // eslint-disable-next-line max-len
  /* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus */
}

export default withGlobalStore(Plugin)
