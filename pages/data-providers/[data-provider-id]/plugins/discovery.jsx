import React from 'react'

import { withGlobalStore } from 'store'
import { Card } from 'design'
import Markdown from 'components/markdown'
import { plugins } from 'texts'
import Title from 'components/title'

const Plugins = ({ store, ...restProps }) => (
  <Card {...restProps}>
    <Title>{plugins.discovery.title}</Title>
    <Markdown>
      {plugins.discovery.description.render({
        key: store.plugins.discovery?.key,
      })}
    </Markdown>
  </Card>
)

export default withGlobalStore(Plugins)
