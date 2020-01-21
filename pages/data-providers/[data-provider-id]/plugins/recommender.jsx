import React from 'react'
import Markdown from 'react-markdown'

import pluginsClassNames from './plugins.css'

import { Card } from 'design'
import { plugins } from 'texts'

const Plugins = () => (
  <Card className={pluginsClassNames.container}>
    <h1>{plugins.recommender.title}</h1>
    <Markdown>{plugins.recommender.description}</Markdown>
  </Card>
)

export default Plugins
