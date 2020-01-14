import React from 'react'
import { Button } from '@oacore/design'

import pluginsClassNames from './plugins.css'

import { Card } from 'design'

const Plugins = () => (
  <main className={pluginsClassNames.container}>
    <h1>Plugins</h1>

    <Card tag="section">
      <h2>Discovery</h2>
      <p>
        Enrich your full text amount by dynamic adding missing bits from CORE
      </p>
      <p>
        Increase your website discoverability by cross-linking similar papers
        help of our powerful recommender system
      </p>

      <Button variant="contained">View</Button>
    </Card>

    <Card tag="section">
      <h2>Recommender</h2>
      <p>
        Increase your website discoverability by cross-linking similar papers
      </p>
      <p>
        Increase your website discoverability by cross-linking similar papers
        with help of our powerful recommender system
      </p>
      <Button variant="contained">View</Button>
    </Card>
  </main>
)

export default Plugins
