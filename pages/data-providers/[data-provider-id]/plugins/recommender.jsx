import React from 'react'

import { withGlobalStore } from 'store'
import { Card } from 'design'
import Markdown from 'components/markdown'
import { plugins } from 'texts'
import Title from 'components/title'

const Plugins = ({ store, ...restProps }) => (
  <Card {...restProps}>
    <Title>{plugins.recommender.title}</Title>
    <Markdown>
      {plugins.recommender.description.render({
        key: store.dataProvider.plugins.recommender?.key,
      })}
    </Markdown>
  </Card>
)

export default withGlobalStore(Plugins)
