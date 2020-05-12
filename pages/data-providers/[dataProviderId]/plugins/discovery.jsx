import React from 'react'

import { withGlobalStore } from 'store'
import { Card } from 'design'
import Markdown from 'components/markdown'
import { plugins } from 'texts'

const Plugins = ({ store, ...restProps }) => (
  <Card {...restProps}>
    <h1>{plugins.discovery.title}</h1>
    <Markdown>
      {plugins.discovery.description.render({
        key: store.plugins.discovery?.key,
      })}
    </Markdown>
  </Card>
)

export default withGlobalStore(Plugins)
