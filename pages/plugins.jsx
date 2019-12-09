import React from 'react'

import Plugin from '../components/plugin'
import pluginsClassNames from './plugins.css'

const integrations = [
  {
    name: 'Discovery',
    abstract:
      'Enrich your full text amount by dynamic adding missing bits from CORE',
    description:
      'Increase your website discoverability by cross-linking similar papers with help of our powerful recommender system',
  },
  {
    name: 'Recommender',
    abstract:
      'Increase your website discoverability by cross-linking similar papers',
    description:
      'Increase your website discoverability by cross-linking similar papers with help of our powerful recommender system',
  },
]

const Plugins = () => {
  return (
    <>
      <h1>Plugins</h1>
      <p>Integrate our powerful services into your website.</p>
      <div className={pluginsClassNames.plugins}>
        {integrations.map(i => (
          <Plugin
            key={i.name}
            name={i.name}
            abstract={i.abstract}
            description={i.description}
          />
        ))}
      </div>
    </>
  )
}

export default Plugins
