import React from 'react'
import API from '@oacore/api'

import pluginsClassNames from './plugins.css'

import Plugin from 'components/plugin'
import { Card } from 'design'

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

class Plugins extends React.Component {
  static async getInitialProps({ initialStoreData }) {
    const { statusCode, ...plugins } = await API.getIntegrations(140)
    initialStoreData.plugins = plugins
  }

  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <Card tag="main">
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
      </Card>
    )
  }
}

export default Plugins
