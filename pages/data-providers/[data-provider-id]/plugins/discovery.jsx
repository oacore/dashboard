import React from 'react'

import pluginsClassNames from './plugins.css'

import { Card } from 'design'
import Markdown from 'components/markdown'
import { plugins } from 'texts'

const key = 'XXXXX'

const Plugins = () => (
  <Card className={pluginsClassNames.container}>
    <h1>{plugins.discovery.title}</h1>
    <Markdown>{plugins.discovery.description.render({ key })}</Markdown>
  </Card>
)

export default Plugins
