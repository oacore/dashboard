import React from 'react'

import pluginsClassNames from './plugins.css'

import { withGlobalStore } from 'store'
import { Card } from 'design'

const Plugins = ({ store }) => (
  <main className={pluginsClassNames.container}>
    <h1>Plugins</h1>

    <Card tag="section">
      <a href="./plugins/discovery">Discovery</a>
      <p>API key: {store.integrations.discovery?.key}</p>
    </Card>

    <Card tag="section">
      <a href="./plugins/recommender">Recommender</a>
      <p>API key: {store.integrations.recommender?.key}</p>
    </Card>
  </main>
)

export default withGlobalStore(Plugins)
