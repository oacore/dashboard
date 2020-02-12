import React from 'react'

import pluginsClassNames from './plugins.css'

import { withGlobalStore } from 'store'
import { Card } from 'design'
import Markdown from 'components/markdown'
import { plugins } from 'texts'

const Plugins = ({ store }) => (
  <Card className={pluginsClassNames.container}>
    <h1>{plugins.discovery.title}</h1>
    <Markdown>
      {plugins.discovery.description.render({
        key: store.integrations.discovery?.key,
      })}
    </Markdown>
  </Card>
)

export default withGlobalStore(Plugins)
