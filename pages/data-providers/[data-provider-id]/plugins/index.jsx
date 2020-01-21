import React from 'react'

import pluginsClassNames from './plugins.css'

import { Card } from 'design'

const Plugins = () => (
  <main className={pluginsClassNames.container}>
    <h1>Plugins</h1>

    <Card tag="section">
      <a href="./discovery">Discovery</a>
    </Card>

    <Card tag="section">
      <a href="./recommender">Recommender</a>
    </Card>
  </main>
)

export default Plugins
