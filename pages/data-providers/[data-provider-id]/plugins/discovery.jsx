import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './discovery.module.css'

import { withGlobalStore } from 'store'
import { Card } from 'design'
import Markdown from 'components/markdown'
import { plugins } from 'texts'
import Title from 'components/title'

const Plugins = ({ store, className, ...restProps }) => (
  <Card className={classNames.use(styles.card, className)} {...restProps}>
    <Title>{plugins.discovery.title}</Title>
    <Markdown>
      {plugins.discovery.description.render({
        key: store.dataProvider?.plugins.discovery?.key,
      })}
    </Markdown>
  </Card>
)

export default withGlobalStore(Plugins)
