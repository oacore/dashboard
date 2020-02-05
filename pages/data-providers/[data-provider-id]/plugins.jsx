import React from 'react'

import pluginsClassNames from './plugins.css'

import Markdown from 'components/markdown'
import { Card, Button } from 'design'
import { plugins } from 'texts'

const Plugins = () => (
  <main className={pluginsClassNames.container}>
    <h1>Plugins</h1>

    <Card tag="section">
      <Markdown>{plugins.discovery.description}</Markdown>
      <Button variant="contained">View</Button>
    </Card>

    <Card tag="section">
      <Markdown>{plugins.recommender.description}</Markdown>
      <Button variant="contained">View</Button>
    </Card>
  </main>
)

export default Plugins
